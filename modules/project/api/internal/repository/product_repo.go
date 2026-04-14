package repository

import (
	"context"
	"errors"
	"time"

	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/model"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// StatusCount holds the count per status for dashboard breakdowns.
type StatusCount struct {
	Status string `json:"status"`
	Count  int64  `json:"count"`
}

// ProductFilters holds optional filter parameters for product queries.
type ProductFilters struct {
	Status   string
	Block    string
	Search   string
	Sort     string // "code_asc", "price_asc", "price_desc", "floor_asc"
	MinPrice float64
	MaxPrice float64
	MinArea  float64
	MaxArea  float64
	Bedrooms int
}

type ProductRepository interface {
	Create(ctx context.Context, product *model.Product) error
	BatchCreate(ctx context.Context, products []model.Product) (int64, error)
	GetByID(ctx context.Context, id string) (*model.Product, error)
	Update(ctx context.Context, product *model.Product) error
	FindByProjectID(ctx context.Context, projectID string, page, limit int) ([]model.Product, int64, error)
	FindByProjectIDWithFilters(ctx context.Context, projectID string, page, limit int, filters ProductFilters) ([]model.Product, int64, error)
	LockProduct(ctx context.Context, id string, bookedBy string, customerName string, customerPhone string, lockedUntil time.Time) error
	UnlockProduct(ctx context.Context, id string) error
	UpdateStatus(ctx context.Context, id string, status model.ProductStatus) error
	Delete(ctx context.Context, id string) error
	CountByProjectID(ctx context.Context, projectID string) (int64, error)
	CountSoldByProjectID(ctx context.Context, projectID string) (int64, error)
	CleanupExpiredLocks(ctx context.Context) (int64, error)
	GetStatusBreakdown(ctx context.Context, projectID string) ([]StatusCount, error)
	GetTotalStatusBreakdown(ctx context.Context) ([]StatusCount, error)
	GetByIDForUpdate(ctx context.Context, id string) (*model.Product, error)
	ExecuteInTx(ctx context.Context, fn func(txRepo ProductRepository) error) error
}

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) GetByIDForUpdate(ctx context.Context, id string) (*model.Product, error) {
	var product model.Product
	err := r.db.WithContext(ctx).Clauses(clause.Locking{Strength: "UPDATE"}).First(&product, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) ExecuteInTx(ctx context.Context, fn func(txRepo ProductRepository) error) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		txRepo := &productRepository{db: tx}
		return fn(txRepo)
	})
}

func (r *productRepository) Create(ctx context.Context, product *model.Product) error {
	return r.db.WithContext(ctx).Create(product).Error
}

// BatchCreate inserts multiple products in a single transaction for performance.
func (r *productRepository) BatchCreate(ctx context.Context, products []model.Product) (int64, error) {
	result := r.db.WithContext(ctx).CreateInBatches(products, 100)
	return result.RowsAffected, result.Error
}

func (r *productRepository) GetByID(ctx context.Context, id string) (*model.Product, error) {
	var product model.Product
	err := r.db.WithContext(ctx).First(&product, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) Update(ctx context.Context, product *model.Product) error {
	return r.db.WithContext(ctx).Save(product).Error
}

func (r *productRepository) FindByProjectID(ctx context.Context, projectID string, page, limit int) ([]model.Product, int64, error) {
	var products []model.Product
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Product{}).Where("project_id = ?", projectID)
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	err = query.Offset(offset).Limit(limit).Order("code ASC").Find(&products).Error
	return products, total, err
}

// FindByProjectIDWithFilters supports advanced filtering, searching, and sorting.
func (r *productRepository) FindByProjectIDWithFilters(ctx context.Context, projectID string, page, limit int, filters ProductFilters) ([]model.Product, int64, error) {
	var products []model.Product
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Product{}).Where("project_id = ?", projectID)

	if filters.Status != "" {
		query = query.Where("status = ?", filters.Status)
	}
	if filters.Block != "" {
		query = query.Where("block = ?", filters.Block)
	}
	if filters.Search != "" {
		lookup := "%" + filters.Search + "%"
		query = query.Where("code ILIKE ? OR block ILIKE ?", lookup, lookup)
	}
	if filters.MinPrice > 0 {
		query = query.Where("price >= ?", filters.MinPrice)
	}
	if filters.MaxPrice > 0 {
		query = query.Where("price <= ?", filters.MaxPrice)
	}
	if filters.MinArea > 0 {
		query = query.Where("area >= ?", filters.MinArea)
	}
	if filters.MaxArea > 0 {
		query = query.Where("area <= ?", filters.MaxArea)
	}
	if filters.Bedrooms > 0 {
		query = query.Where("bedrooms = ?", filters.Bedrooms)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	orderClause := "code ASC"
	switch filters.Sort {
	case "price_asc":
		orderClause = "price ASC"
	case "price_desc":
		orderClause = "price DESC"
	case "floor_asc":
		orderClause = "floor ASC"
	case "area_desc":
		orderClause = "area DESC"
	}

	offset := (page - 1) * limit
	err = query.Offset(offset).Limit(limit).Order(orderClause).Find(&products).Error
	return products, total, err
}

// LockProduct applies an atomic update to lock a product mitigating race conditions.
func (r *productRepository) LockProduct(ctx context.Context, id string, bookedBy string, customerName string, customerPhone string, lockedUntil time.Time) error {
	result := r.db.WithContext(ctx).Model(&model.Product{}).
		Where("id = ? AND status = ?", id, model.ProductStatusAvailable).
		Updates(map[string]interface{}{
			"status":         model.ProductStatusLocked,
			"booked_by":      bookedBy,
			"customer_name":  customerName,
			"customer_phone": customerPhone,
			"locked_until":   lockedUntil,
		})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("căn đã bị khoá bởi người khác hoặc không ở trạng thái mở bán")
	}
	return nil
}

func (r *productRepository) UnlockProduct(ctx context.Context, id string) error {
	result := r.db.WithContext(ctx).Model(&model.Product{}).
		Where("id = ?", id).
		Updates(map[string]interface{}{
			"status":       model.ProductStatusAvailable,
			"booked_by":    nil,
			"locked_until": nil,
		})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("không tìm thấy căn để mở khoá")
	}
	return nil
}

func (r *productRepository) UpdateStatus(ctx context.Context, id string, status model.ProductStatus) error {
	return r.db.WithContext(ctx).Model(&model.Product{}).Where("id = ?", id).Update("status", status).Error
}

func (r *productRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&model.Product{}, "id = ?", id).Error
}

func (r *productRepository) CountByProjectID(ctx context.Context, projectID string) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.Product{}).Where("project_id = ?", projectID).Count(&count).Error
	return count, err
}

func (r *productRepository) CountSoldByProjectID(ctx context.Context, projectID string) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&model.Product{}).
		Where("project_id = ? AND status IN ?", projectID, []model.ProductStatus{
			model.ProductStatusSold, model.ProductStatusCompleted,
		}).Count(&count).Error
	return count, err
}

func (r *productRepository) CleanupExpiredLocks(ctx context.Context) (int64, error) {
	result := r.db.WithContext(ctx).Model(&model.Product{}).
		Where("status = ? AND locked_until < ?", model.ProductStatusLocked, time.Now()).
		Updates(map[string]interface{}{
			"status":       model.ProductStatusAvailable,
			"booked_by":    nil,
			"locked_until": nil,
		})
	return result.RowsAffected, result.Error
}

// GetStatusBreakdown returns the count of products grouped by status for a project.
func (r *productRepository) GetStatusBreakdown(ctx context.Context, projectID string) ([]StatusCount, error) {
	var results []StatusCount
	err := r.db.WithContext(ctx).Model(&model.Product{}).
		Select("status, COUNT(*) as count").
		Where("project_id = ?", projectID).
		Group("status").
		Scan(&results).Error
	return results, err
}

// GetTotalStatusBreakdown returns status breakdown across all projects.
func (r *productRepository) GetTotalStatusBreakdown(ctx context.Context) ([]StatusCount, error) {
	var results []StatusCount
	err := r.db.WithContext(ctx).Model(&model.Product{}).
		Select("status, COUNT(*) as count").
		Group("status").
		Scan(&results).Error
	return results, err
}
