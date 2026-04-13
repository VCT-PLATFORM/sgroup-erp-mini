package repository

import (
	"context"

	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/domain"
	"gorm.io/gorm"
)

type PayrollRepository interface {
	CreateRun(ctx context.Context, run *domain.PayrollRun) error
	GetRunByID(ctx context.Context, id string) (*domain.PayrollRun, error)
	ListRuns(ctx context.Context, offset, limit int) ([]domain.PayrollRun, int64, error)
	UpdateRunStatus(ctx context.Context, id string, status string) error

	BulkCreatePayslips(ctx context.Context, payslips []domain.Payslip) error
	GetPayslipsByRunID(ctx context.Context, runID string) ([]domain.Payslip, error)
	
	// Methods to help calculation
	GetActiveContracts(ctx context.Context) ([]domain.EmploymentContract, error)
}

type payrollRepository struct {
	db *gorm.DB
}

func NewPayrollRepository(db *gorm.DB) PayrollRepository {
	return &payrollRepository{db: db}
}

func (r *payrollRepository) CreateRun(ctx context.Context, run *domain.PayrollRun) error {
	return r.db.WithContext(ctx).Create(run).Error
}

func (r *payrollRepository) GetRunByID(ctx context.Context, id string) (*domain.PayrollRun, error) {
	var run domain.PayrollRun
	err := r.db.WithContext(ctx).First(&run, id).Error
	return &run, err
}

func (r *payrollRepository) ListRuns(ctx context.Context, offset, limit int) ([]domain.PayrollRun, int64, error) {
	var runs []domain.PayrollRun
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.PayrollRun{})
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Order("cycle_start DESC").Offset(offset).Limit(limit).Find(&runs).Error
	return runs, total, err
}

func (r *payrollRepository) UpdateRunStatus(ctx context.Context, id string, status string) error {
	return r.db.WithContext(ctx).Model(&domain.PayrollRun{}).Where("id = ?", id).Update("status", status).Error
}

func (r *payrollRepository) BulkCreatePayslips(ctx context.Context, payslips []domain.Payslip) error {
	// Only proceed if length > 0 to prevent Gorm error
	if len(payslips) == 0 {
		return nil
	}
	return r.db.WithContext(ctx).Create(&payslips).Error
}

func (r *payrollRepository) GetPayslipsByRunID(ctx context.Context, runID string) ([]domain.Payslip, error) {
	var slips []domain.Payslip
	err := r.db.WithContext(ctx).
		Preload("Employee").
		Preload("Employee.Department").
		Preload("Employee.Position").
		Where("payroll_run_id = ?", runID).
		Find(&slips).Error
	return slips, err
}

func (r *payrollRepository) GetActiveContracts(ctx context.Context) ([]domain.EmploymentContract, error) {
	var contracts []domain.EmploymentContract
	err := r.db.WithContext(ctx).
		Preload("Employee").
		Where("status = ?", "Active").
		Find(&contracts).Error
	return contracts, err
}
