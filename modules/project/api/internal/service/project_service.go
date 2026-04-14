package service

import (
	"context"
	"time"

	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/infrastructure/cache"
	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/infrastructure/messaging"
	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/model"
	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/repository"
)

type ProjectService interface {
	CreateProject(ctx context.Context, req *model.Project) (*model.Project, error)
	GetProject(ctx context.Context, id string) (*model.Project, error)
	ListProjects(ctx context.Context, page, limit int, search string) ([]model.Project, int64, error)
	UpdateProject(ctx context.Context, id string, fields map[string]interface{}) (*model.Project, error)
	DeleteProject(ctx context.Context, id string) error
	SyncProjectUnits(ctx context.Context, id string) error
	GetDashboardStats(ctx context.Context) (*repository.DashboardAggregates, error)
}

type projectService struct {
	projectRepo repository.ProjectRepository
	productRepo repository.ProductRepository
	eventBus    messaging.EventPublisher
	cache       *cache.RedisCache
}

func NewProjectService(projectRepo repository.ProjectRepository, productRepo repository.ProductRepository, eventBus messaging.EventPublisher, redisCache *cache.RedisCache) ProjectService {
	return &projectService{
		projectRepo: projectRepo,
		productRepo: productRepo,
		eventBus:    eventBus,
		cache:       redisCache,
	}
}

func (s *projectService) CreateProject(ctx context.Context, req *model.Project) (*model.Project, error) {
	err := s.projectRepo.Create(ctx, req)
	if err != nil {
		return nil, err
	}
	
	// Publish Event
	_ = s.eventBus.PublishEvent("project.created", req)
	
	return req, nil
}

func (s *projectService) GetProject(ctx context.Context, id string) (*model.Project, error) {
	return s.projectRepo.GetByID(ctx, id)
}

func (s *projectService) ListProjects(ctx context.Context, page, limit int, search string) ([]model.Project, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	return s.projectRepo.FindAll(ctx, page, limit, search)
}

func (s *projectService) UpdateProject(ctx context.Context, id string, fields map[string]interface{}) (*model.Project, error) {
	existing, err := s.projectRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Apply partial update fields
	if v, ok := fields["name"]; ok {
		existing.Name = v.(string)
	}
	if v, ok := fields["description"]; ok {
		existing.Description = v.(string)
	}
	if v, ok := fields["developer"]; ok {
		existing.Developer = v.(string)
	}
	if v, ok := fields["location"]; ok {
		existing.Location = v.(string)
	}
	if v, ok := fields["province"]; ok {
		existing.Province = v.(string)
	}
	if v, ok := fields["district"]; ok {
		existing.District = v.(string)
	}
	if v, ok := fields["imageUrl"]; ok {
		existing.ImageURL = v.(string)
	}
	if v, ok := fields["type"]; ok {
		existing.Type = model.PropertyType(v.(string))
	}
	if v, ok := fields["feeRate"]; ok {
		existing.FeeRate = v.(float64)
	}
	if v, ok := fields["avgPrice"]; ok {
		existing.AvgPrice = v.(float64)
	}
	if v, ok := fields["status"]; ok {
		existing.Status = model.ProjectStatus(v.(string))
	}
	if v, ok := fields["managerName"]; ok {
		existing.ManagerName = v.(string)
	}
	if v, ok := fields["managerId"]; ok {
		existing.ManagerID = v.(string)
	}

	if err := s.projectRepo.Update(ctx, existing); err != nil {
		return nil, err
	}

	_ = s.eventBus.PublishEvent("project.updated", existing)

	return existing, nil
}

func (s *projectService) DeleteProject(ctx context.Context, id string) error {
	return s.projectRepo.Delete(ctx, id)
}

// SyncProjectUnits recalculates totalUnits and soldUnits from actual product records.
func (s *projectService) SyncProjectUnits(ctx context.Context, id string) error {
	total, err := s.productRepo.CountByProjectID(ctx, id)
	if err != nil {
		return err
	}
	sold, err := s.productRepo.CountSoldByProjectID(ctx, id)
	if err != nil {
		return err
	}

	if err := s.projectRepo.UpdateTotalUnits(ctx, id, int(total)); err != nil {
		return err
	}
	if err := s.projectRepo.UpdateSoldUnits(ctx, id, int(sold)); err != nil {
		return err
	}
	return nil
}

// GetDashboardStats returns aggregated statistics for the dashboard.
func (s *projectService) GetDashboardStats(ctx context.Context) (*repository.DashboardAggregates, error) {
	if s.cache != nil {
		var stats repository.DashboardAggregates
		err := s.cache.Get(ctx, "dashboard:stats", &stats)
		if err == nil {
			return &stats, nil
		}
	}

	stats, err := s.projectRepo.GetDashboardAggregates(ctx)
	if err != nil {
		return nil, err
	}

	if s.cache != nil {
		_ = s.cache.Set(ctx, "dashboard:stats", stats, 15*time.Second)
	}

	return stats, nil
}

