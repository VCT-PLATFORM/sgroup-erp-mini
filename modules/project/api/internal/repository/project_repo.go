package repository

import (
	"context"

	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/model"
	"gorm.io/gorm"
)

// DashboardAggregates holds summary stats for the dashboard.
type DashboardAggregates struct {
	TotalProjects  int64   `json:"totalProjects"`
	ActiveProjects int64   `json:"activeProjects"`
	TotalUnits     int64   `json:"totalUnits"`
	SoldUnits      int64   `json:"soldUnits"`
	TotalRevenue   float64 `json:"totalRevenue"` // avgPrice * soldUnits estimate
}

type ProjectRepository interface {
	Create(ctx context.Context, project *model.Project) error
	GetByID(ctx context.Context, id string) (*model.Project, error)
	FindAll(ctx context.Context, page, limit int, search string) ([]model.Project, int64, error)
	FindByStatus(ctx context.Context, status string, page, limit int) ([]model.Project, int64, error)
	Update(ctx context.Context, project *model.Project) error
	Delete(ctx context.Context, id string) error
	UpdateSoldUnits(ctx context.Context, id string, soldUnits int) error
	UpdateTotalUnits(ctx context.Context, id string, totalUnits int) error
	GetDashboardAggregates(ctx context.Context) (*DashboardAggregates, error)
}

type projectRepository struct {
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) ProjectRepository {
	return &projectRepository{db: db}
}

func (r *projectRepository) Create(ctx context.Context, project *model.Project) error {
	return r.db.WithContext(ctx).Create(project).Error
}

func (r *projectRepository) GetByID(ctx context.Context, id string) (*model.Project, error) {
	var project model.Project
	err := r.db.WithContext(ctx).First(&project, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *projectRepository) FindAll(ctx context.Context, page, limit int, search string) ([]model.Project, int64, error) {
	var projects []model.Project
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Project{})
	
	if search != "" {
		lookup := "%" + search + "%"
		query = query.Where("name ILIKE ? OR code ILIKE ? OR developer ILIKE ? OR location ILIKE ?", lookup, lookup, lookup, lookup)
	}

	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	err = query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&projects).Error
	return projects, total, err
}

// FindByStatus filters projects by status.
func (r *projectRepository) FindByStatus(ctx context.Context, status string, page, limit int) ([]model.Project, int64, error) {
	var projects []model.Project
	var total int64

	query := r.db.WithContext(ctx).Model(&model.Project{}).Where("status = ?", status)
	err := query.Count(&total).Error
	if err != nil {
		return nil, 0, err
	}

	offset := (page - 1) * limit
	err = query.Offset(offset).Limit(limit).Order("created_at DESC").Find(&projects).Error
	return projects, total, err
}

func (r *projectRepository) Update(ctx context.Context, project *model.Project) error {
	return r.db.WithContext(ctx).Save(project).Error
}

func (r *projectRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&model.Project{}, "id = ?", id).Error
}

func (r *projectRepository) UpdateSoldUnits(ctx context.Context, id string, soldUnits int) error {
	return r.db.WithContext(ctx).Model(&model.Project{}).Where("id = ?", id).Update("sold_units", soldUnits).Error
}

func (r *projectRepository) UpdateTotalUnits(ctx context.Context, id string, totalUnits int) error {
	return r.db.WithContext(ctx).Model(&model.Project{}).Where("id = ?", id).Update("total_units", totalUnits).Error
}

// GetDashboardAggregates computes summary statistics for the dashboard.
func (r *projectRepository) GetDashboardAggregates(ctx context.Context) (*DashboardAggregates, error) {
	var agg DashboardAggregates

	// Total projects
	err := r.db.WithContext(ctx).Model(&model.Project{}).Count(&agg.TotalProjects).Error
	if err != nil {
		return nil, err
	}

	// Active projects
	err = r.db.WithContext(ctx).Model(&model.Project{}).Where("status = ?", "SELLING").Count(&agg.ActiveProjects).Error
	if err != nil {
		return nil, err
	}

	// Sum units
	type sumResult struct {
		TotalUnits int64   `gorm:"column:total_units_sum"`
		SoldUnits  int64   `gorm:"column:sold_units_sum"`
		Revenue    float64 `gorm:"column:revenue_est"`
	}
	var sr sumResult
	err = r.db.WithContext(ctx).Model(&model.Project{}).
		Select("COALESCE(SUM(total_units), 0) as total_units_sum, COALESCE(SUM(sold_units), 0) as sold_units_sum, COALESCE(SUM(avg_price * sold_units), 0) as revenue_est").
		Scan(&sr).Error
	if err != nil {
		return nil, err
	}

	agg.TotalUnits = sr.TotalUnits
	agg.SoldUnits = sr.SoldUnits
	agg.TotalRevenue = sr.Revenue

	return &agg, nil
}

