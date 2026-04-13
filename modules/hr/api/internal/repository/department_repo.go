package repository

import (
	"context"

	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/domain"
	"gorm.io/gorm"
)

type DepartmentRepository interface {
	Create(ctx context.Context, dept *domain.Department) error
	Update(ctx context.Context, id string, data map[string]interface{}) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context) ([]domain.Department, error)
}

type departmentRepository struct {
	db *gorm.DB
}

func NewDepartmentRepository(db *gorm.DB) DepartmentRepository {
	return &departmentRepository{db: db}
}

func (r *departmentRepository) Create(ctx context.Context, dept *domain.Department) error {
	return r.db.WithContext(ctx).Create(dept).Error
}

func (r *departmentRepository) Update(ctx context.Context, id string, data map[string]interface{}) error {
	return r.db.WithContext(ctx).Model(&domain.Department{}).Where("id = ?", id).Updates(data).Error
}

func (r *departmentRepository) Delete(ctx context.Context, id string) error {
	return r.db.WithContext(ctx).Delete(&domain.Department{}, id).Error
}

func (r *departmentRepository) List(ctx context.Context) ([]domain.Department, error) {
	var depts []domain.Department
	err := r.db.WithContext(ctx).
		Preload("SubDepts"). // Load 1 level of hierarchy
		Where("parent_id IS NULL"). // Get root departments
		Find(&depts).Error
	return depts, err
}

