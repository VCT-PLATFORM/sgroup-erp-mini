package service

import (
	"context"
	"errors"
	"time"

	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/model"
	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/repository"
	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/infrastructure/cache"
)

type ProductService interface {
	CreateProduct(ctx context.Context, req *model.Product) (*model.Product, error)
	BatchCreateProducts(ctx context.Context, projectID string, products []model.Product) (int64, error)
	GetProduct(ctx context.Context, id string) (*model.Product, error)
	UpdateProduct(ctx context.Context, id string, fields map[string]interface{}) (*model.Product, error)
	ListProjectProducts(ctx context.Context, projectID string, page, limit int) ([]model.Product, int64, error)
	ListProjectProductsFiltered(ctx context.Context, projectID string, page, limit int, filters repository.ProductFilters) ([]model.Product, int64, error)
	LockProduct(ctx context.Context, id string, bookedBy string, customerName string, customerPhone string, lockDurationHours int) error
	BulkLockProducts(ctx context.Context, ids []string, bookedBy string, customerName string, customerPhone string, lockDurationHours int) error
	UnlockProduct(ctx context.Context, id string, requestedBy string, isAdmin bool) error
	BulkUnlockProducts(ctx context.Context, ids []string, requestedBy string, isAdmin bool) error
	DepositProduct(ctx context.Context, id string, requestedBy string) error
	SoldProduct(ctx context.Context, id string, requestedBy string) (string, error) // returns projectID
	UpdateProductStatus(ctx context.Context, id string, status model.ProductStatus) error
	DeleteProduct(ctx context.Context, id string) (string, error) // returns projectID for sync
	CleanupLocks(ctx context.Context) (int64, error)
	GetStatusBreakdown(ctx context.Context, projectID string) ([]repository.StatusCount, error)
	GetTotalStatusBreakdown(ctx context.Context) ([]repository.StatusCount, error)
}

type productService struct {
	productRepo repository.ProductRepository
	auditRepo   repository.AuditLogRepository
	cache       *cache.RedisCache
}

func NewProductService(productRepo repository.ProductRepository, auditRepo repository.AuditLogRepository, redisCache *cache.RedisCache) ProductService {
	return &productService{
		productRepo: productRepo,
		auditRepo:   auditRepo,
		cache:       redisCache,
	}
}

func (s *productService) CreateProduct(ctx context.Context, req *model.Product) (*model.Product, error) {
	err := s.productRepo.Create(ctx, req)
	if err != nil {
		return nil, err
	}
	return req, nil
}

// BatchCreateProducts inserts multiple products in a single transaction.
func (s *productService) BatchCreateProducts(ctx context.Context, projectID string, products []model.Product) (int64, error) {
	for i := range products {
		products[i].ProjectID = projectID
		if products[i].Status == "" {
			products[i].Status = model.ProductStatusAvailable
		}
	}
	return s.productRepo.BatchCreate(ctx, products)
}

func (s *productService) GetProduct(ctx context.Context, id string) (*model.Product, error) {
	return s.productRepo.GetByID(ctx, id)
}

func (s *productService) UpdateProduct(ctx context.Context, id string, fields map[string]interface{}) (*model.Product, error) {
	existing, err := s.productRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if v, ok := fields["code"]; ok {
		existing.Code = v.(string)
	}
	if v, ok := fields["block"]; ok {
		existing.Block = v.(string)
	}
	if v, ok := fields["floor"]; ok {
		existing.Floor = int(v.(float64))
	}
	if v, ok := fields["area"]; ok {
		existing.Area = v.(float64)
	}
	if v, ok := fields["price"]; ok {
		existing.Price = v.(float64)
	}
	if v, ok := fields["direction"]; ok {
		existing.Direction = v.(string)
	}
	if v, ok := fields["bedrooms"]; ok {
		existing.Bedrooms = int(v.(float64))
	}
	if v, ok := fields["unitType"]; ok {
		existing.UnitType = v.(string)
	}
	if v, ok := fields["viewDesc"]; ok {
		existing.ViewDesc = v.(string)
	}

	if err := s.productRepo.Update(ctx, existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *productService) ListProjectProducts(ctx context.Context, projectID string, page, limit int) ([]model.Product, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 500 {
		limit = 50
	}
	return s.productRepo.FindByProjectID(ctx, projectID, page, limit)
}

func (s *productService) ListProjectProductsFiltered(ctx context.Context, projectID string, page, limit int, filters repository.ProductFilters) ([]model.Product, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 500 {
		limit = 50
	}
	return s.productRepo.FindByProjectIDWithFilters(ctx, projectID, page, limit, filters)
}

func (s *productService) LockProduct(ctx context.Context, id string, bookedBy string, customerName string, customerPhone string, lockDurationHours int) error {
	lockedUntil := time.Now().Add(time.Duration(lockDurationHours) * time.Hour)
	err := s.productRepo.LockProduct(ctx, id, bookedBy, customerName, customerPhone, lockedUntil)
	if err == nil && s.auditRepo != nil {
		_ = s.auditRepo.Create(ctx, &model.AuditLog{
			UserID:     bookedBy,
			Action:     "LOCK",
			EntityType: "Product",
			EntityID:   id,
			Details:    "Locked product for 24h for customer: " + customerName,
		})
	}
	return err
}

func (s *productService) BulkLockProducts(ctx context.Context, ids []string, bookedBy string, customerName string, customerPhone string, lockDurationHours int) error {
	lockedUntil := time.Now().Add(time.Duration(lockDurationHours) * time.Hour)
	err := s.productRepo.ExecuteInTx(ctx, func(txRepo repository.ProductRepository) error {
		for _, id := range ids {
			product, err := txRepo.GetByIDForUpdate(ctx, id)
			if err != nil {
				return errors.New("căn " + id + " không tồn tại hoặc lỗi: " + err.Error())
			}
			if product.Status != model.ProductStatusAvailable {
				return errors.New("căn " + product.Code + " đã bị giữ chỗ hoặc bán, thao tác hàng loạt bị hủy")
			}
			err = txRepo.LockProduct(ctx, id, bookedBy, customerName, customerPhone, lockedUntil)
			if err != nil {
				return err
			}
		}
		return nil
	})

	if err == nil && s.auditRepo != nil {
		for _, id := range ids {
			_ = s.auditRepo.Create(ctx, &model.AuditLog{
				UserID:     bookedBy,
				Action:     "BULK_LOCK",
				EntityType: "Product",
				EntityID:   id,
				Details:    "Bulk locked for 24h for customer: " + customerName,
			})
		}
	}
	return err
}

func (s *productService) UnlockProduct(ctx context.Context, id string, requestedBy string, isAdmin bool) error {
	err := s.productRepo.ExecuteInTx(ctx, func(txRepo repository.ProductRepository) error {
		product, err := txRepo.GetByIDForUpdate(ctx, id)
		if err != nil {
			return err
		}
		if product.Status != model.ProductStatusLocked {
			return errors.New("căn không ở trạng thái khoá")
		}
		if !isAdmin && product.BookedBy != nil && *product.BookedBy != requestedBy {
			return errors.New("không có quyền mở khoá căn của người khác")
		}

		return txRepo.UnlockProduct(ctx, id)
	})

	if err == nil && s.auditRepo != nil {
		_ = s.auditRepo.Create(ctx, &model.AuditLog{
			UserID:     requestedBy,
			Action:     "UNLOCK",
			EntityType: "Product",
			EntityID:   id,
			Details:    "Unlocked product",
		})
	}
	return err
}

func (s *productService) BulkUnlockProducts(ctx context.Context, ids []string, requestedBy string, isAdmin bool) error {
	err := s.productRepo.ExecuteInTx(ctx, func(txRepo repository.ProductRepository) error {
		for _, id := range ids {
			product, err := txRepo.GetByIDForUpdate(ctx, id)
			if err != nil {
				return err
			}
			if product.Status != model.ProductStatusLocked {
				continue // Skip if not locked, no big deal for bulk unlock
			}
			if !isAdmin && product.BookedBy != nil && *product.BookedBy != requestedBy {
				return errors.New("không có quyền mở khoá căn " + product.Code + " của người khác")
			}

			err = txRepo.UnlockProduct(ctx, id)
			if err != nil {
				return err
			}
		}
		return nil
	})

	if err == nil && s.auditRepo != nil {
		for _, id := range ids {
			_ = s.auditRepo.Create(ctx, &model.AuditLog{
				UserID:     requestedBy,
				Action:     "BULK_UNLOCK",
				EntityType: "Product",
				EntityID:   id,
				Details:    "Bulk Unlocked product",
			})
		}
	}
	return err
}

func (s *productService) DepositProduct(ctx context.Context, id string, requestedBy string) error {
	err := s.productRepo.ExecuteInTx(ctx, func(txRepo repository.ProductRepository) error {
		product, err := txRepo.GetByIDForUpdate(ctx, id)
		if err != nil {
			return err
		}
		if product.Status != model.ProductStatusLocked {
			return errors.New("căn phải đang bị khoá mới có thể vào cọc")
		}

		return txRepo.UpdateStatus(ctx, id, model.ProductStatusDeposit)
	})

	if err == nil && s.auditRepo != nil {
		_ = s.auditRepo.Create(ctx, &model.AuditLog{
			UserID:     requestedBy,
			Action:     "DEPOSIT",
			EntityType: "Product",
			EntityID:   id,
			Details:    "Vào cọc sản phẩm",
		})
	}
	return err
}

// SoldProduct marks product as sold and returns the projectID for sync
func (s *productService) SoldProduct(ctx context.Context, id string, requestedBy string) (string, error) {
	var projectID string
	err := s.productRepo.ExecuteInTx(ctx, func(txRepo repository.ProductRepository) error {
		product, err := txRepo.GetByIDForUpdate(ctx, id)
		if err != nil {
			return err
		}
		if product.Status != model.ProductStatusDeposit {
			return errors.New("căn phải đang ở trạng thái đặt cọc mới có thể giao dịch Thành công (Đã Bán)")
		}

		projectID = product.ProjectID
		return txRepo.UpdateStatus(ctx, id, model.ProductStatusSold)
	})

	if err == nil && s.auditRepo != nil {
		_ = s.auditRepo.Create(ctx, &model.AuditLog{
			UserID:     requestedBy,
			Action:     "SOLD",
			EntityType: "Product",
			EntityID:   id,
			Details:    "Giao dịch đã bán/Hợp đồng",
		})
	}
	if err != nil {
		return "", err
	}
	return projectID, nil
}

func (s *productService) UpdateProductStatus(ctx context.Context, id string, status model.ProductStatus) error {
	return s.productRepo.UpdateStatus(ctx, id, status)
}

// DeleteProduct removes a product and returns its projectID so the caller can sync units.
func (s *productService) DeleteProduct(ctx context.Context, id string) (string, error) {
	product, err := s.productRepo.GetByID(ctx, id)
	if err != nil {
		return "", err
	}
	projectID := product.ProjectID
	err = s.productRepo.Delete(ctx, id)
	if err != nil {
		return "", err
	}
	return projectID, nil
}

func (s *productService) CleanupLocks(ctx context.Context) (int64, error) {
	return s.productRepo.CleanupExpiredLocks(ctx)
}

func (s *productService) GetStatusBreakdown(ctx context.Context, projectID string) ([]repository.StatusCount, error) {
	return s.productRepo.GetStatusBreakdown(ctx, projectID)
}

func (s *productService) GetTotalStatusBreakdown(ctx context.Context) ([]repository.StatusCount, error) {
	if s.cache != nil {
		var breakdown []repository.StatusCount
		err := s.cache.Get(ctx, "dashboard:breakdown", &breakdown)
		if err == nil {
			return breakdown, nil
		}
	}

	breakdown, err := s.productRepo.GetTotalStatusBreakdown(ctx)
	if err != nil {
		return nil, err
	}

	if s.cache != nil {
		_ = s.cache.Set(ctx, "dashboard:breakdown", breakdown, 15*time.Second)
	}

	return breakdown, nil
}

