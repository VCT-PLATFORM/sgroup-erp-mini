package repository

import (
	"context"

	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/domain"
	"gorm.io/gorm"
)

type TeamRepository interface {
	Create(ctx context.Context, team *domain.Team) error
	GetByID(ctx context.Context, id string) (*domain.Team, error)
	Update(ctx context.Context, id string, data map[string]interface{}) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, departmentID *string) ([]domain.Team, error)
}

type teamRepository struct {
	db *gorm.DB
}

func NewTeamRepository(db *gorm.DB) TeamRepository {
	return &teamRepository{db: db}
}

func (r *teamRepository) Create(ctx context.Context, team *domain.Team) error {
	return r.db.WithContext(ctx).Create(team).Error
}

func (r *teamRepository) GetByID(ctx context.Context, id string) (*domain.Team, error) {
	var team domain.Team
	err := r.db.WithContext(ctx).First(&team, id).Error
	return &team, err
}

func (r *teamRepository) Update(ctx context.Context, id string, data map[string]interface{}) error {
	return r.db.WithContext(ctx).Model(&domain.Team{}).Where("id = ?", id).Updates(data).Error
}

func (r *teamRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&domain.Team{}, id).Error
}

func (r *teamRepository) List(ctx context.Context, departmentID *string) ([]domain.Team, error) {
	var teams []domain.Team
	q := r.db.WithContext(ctx)
	if departmentID != nil {
		q = q.Where("department_id = ?", *departmentID)
	}
	err := q.Find(&teams).Error
	return teams, err
}
