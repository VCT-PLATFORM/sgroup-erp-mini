package repository

import (
	"context"

	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/domain"
	"gorm.io/gorm"
)

type AttendanceRepository interface {
	Create(ctx context.Context, record *domain.AttendanceRecord) error
	Update(ctx context.Context, record *domain.AttendanceRecord) error
	GetByID(ctx context.Context, id string) (*domain.AttendanceRecord, error)
	List(ctx context.Context, offset, limit int, employeeID *string, startDate, endDate *string) ([]domain.AttendanceRecord, int64, error)
	ListByEmployeeIDs(ctx context.Context, employeeIDs []string, startDate, endDate string) ([]domain.AttendanceRecord, error)
}

type attendanceRepository struct {
	db *gorm.DB
}

func NewAttendanceRepository(db *gorm.DB) AttendanceRepository {
	return &attendanceRepository{db: db}
}

func (r *attendanceRepository) Create(ctx context.Context, record *domain.AttendanceRecord) error {
	return r.db.WithContext(ctx).Create(record).Error
}

func (r *attendanceRepository) Update(ctx context.Context, record *domain.AttendanceRecord) error {
	return r.db.WithContext(ctx).Save(record).Error
}

func (r *attendanceRepository) GetByID(ctx context.Context, id string) (*domain.AttendanceRecord, error) {
	var record domain.AttendanceRecord
	err := r.db.WithContext(ctx).
		Preload("Employee").
		First(&record, id).Error
	return &record, err
}

func (r *attendanceRepository) List(ctx context.Context, offset, limit int, employeeID *string, startDate, endDate *string) ([]domain.AttendanceRecord, int64, error) {
	var records []domain.AttendanceRecord
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.AttendanceRecord{})

	if employeeID != nil && *employeeID != "" {
		query = query.Where("employee_id = ?", *employeeID)
	}
	if startDate != nil && *startDate != "" {
		query = query.Where("date >= ?", *startDate)
	}
	if endDate != nil && *endDate != "" {
		query = query.Where("date <= ?", *endDate)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Preload("Employee").
		Order("date DESC, created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&records).Error

	return records, total, err
}

func (r *attendanceRepository) ListByEmployeeIDs(ctx context.Context, employeeIDs []string, startDate, endDate string) ([]domain.AttendanceRecord, error) {
	if len(employeeIDs) == 0 {
		return nil, nil // Return empty if no IDs to avoid SQL syntax error
	}

	var records []domain.AttendanceRecord
	err := r.db.WithContext(ctx).Model(&domain.AttendanceRecord{}).
		Where("employee_id IN ?", employeeIDs).
		Where("date >= ? AND date <= ?", startDate, endDate).
		Find(&records).Error

	return records, err
}
