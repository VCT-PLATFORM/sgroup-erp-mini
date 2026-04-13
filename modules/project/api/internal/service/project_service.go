package service

import (
	"context"

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
}

type projectService struct {
	projectRepo repository.ProjectRepository
	productRepo repository.ProductRepository
	eventBus    messaging.EventPublisher
}

func NewProjectService(projectRepo repository.ProjectRepository, productRepo repository.ProductRepository, eventBus messaging.EventPublisher) ProjectService {
	return &projectService{
		projectRepo: projectRepo,
		productRepo: productRepo,
		eventBus:    eventBus,
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
