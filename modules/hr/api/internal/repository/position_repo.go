package repository

import (
	"context"

	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/domain"
	"gorm.io/gorm"
)

type PositionRepository interface {
	Create(ctx context.Context, pos *domain.Position) error
	GetByID(ctx context.Context, id string) (*domain.Position, error)
	Update(ctx context.Context, id string, data map[string]interface{}) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context) ([]domain.Position, error)
}

type positionRepository struct {
	db *gorm.DB
}

func NewPositionRepository(db *gorm.DB) PositionRepository {
	return &positionRepository{db: db}
}

func (r *positionRepository) Create(ctx context.Context, pos *domain.Position) error {
	return r.db.WithContext(ctx).Create(pos).Error
}

func (r *positionRepository) GetByID(ctx context.Context, id string) (*domain.Position, error) {
	var pos domain.Position
	err := r.db.WithContext(ctx).First(&pos, id).Error
	return &pos, err
}

func (r *positionRepository) Update(ctx context.Context, id string, data map[string]interface{}) error {
	return r.db.WithContext(ctx).Model(&domain.Position{}).Where("id = ?", id).Updates(data).Error
}

func (r *positionRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&domain.Position{}, id).Error
}

func (r *positionRepository) List(ctx context.Context) ([]domain.Position, error) {
	var positions []domain.Position
	err := r.db.WithContext(ctx).Find(&positions).Error
	return positions, err
}
