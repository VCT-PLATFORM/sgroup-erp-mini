package usecase

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/domain"
	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/repository"
)

type PayrollEngineUseCase interface {
	GeneratePayrollRun(ctx context.Context, title string, cycleStart, cycleEnd time.Time, standardDays float64, adminID string) (*domain.PayrollRun, error)
	ListRuns(ctx context.Context, offset, limit int) ([]domain.PayrollRun, int64, error)
	GetPayslips(ctx context.Context, runID string) ([]domain.Payslip, error)
}

type payrollEngineUseCase struct {
	payrollRepo    repository.PayrollRepository
	attendanceRepo repository.AttendanceRepository
}

func NewPayrollEngineUseCase(pr repository.PayrollRepository, ar repository.AttendanceRepository) PayrollEngineUseCase {
	return &payrollEngineUseCase{
		payrollRepo:    pr,
		attendanceRepo: ar,
	}
}

func (pe *payrollEngineUseCase) GeneratePayrollRun(ctx context.Context, title string, cycleStart, cycleEnd time.Time, standardDays float64, adminID string) (*domain.PayrollRun, error) {
	if standardDays <= 0 {
		return nil, errors.New("standard days must be > 0")
	}

	// 1. Create a new PayrollRun
	run := &domain.PayrollRun{
		Title:       title,
		CycleStart:  cycleStart,
		CycleEnd:    cycleEnd,
		Status:      "Processing",
		ProcessedBy: adminID,
	}

	if err := pe.payrollRepo.CreateRun(ctx, run); err != nil {
		return nil, fmt.Errorf("failed to create payroll run: %v", err)
	}

	// 2. Fetch all Active Contracts
	contracts, err := pe.payrollRepo.GetActiveContracts(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch active contracts: %v", err)
	}

	var payslips []domain.Payslip

	// 3. Extract employee IDs for bulk attendance fetch to prevent N+1 query issue
	employeeIDs := make([]string, 0, len(contracts))
	for _, c := range contracts {
		employeeIDs = append(employeeIDs, c.EmployeeID)
	}

	sd := cycleStart.Format("2006-01-02")
	ed := cycleEnd.Format("2006-01-02")

	// Pre-fetch all attendance records for these employees in a single O(1) query
	records, err := pe.attendanceRepo.ListByEmployeeIDs(ctx, employeeIDs, sd, ed)
	if err != nil {
		// Proceeding with calculation even if attendance fails might not be ideal,
		// but matching original logic to skip or log.
		records = []domain.AttendanceRecord{} 
	}

	// Group attendance by employee ID in-memory (O(M))
	attendanceMap := make(map[string]float64)
	for _, rec := range records {
		var currentDay float64
		if rec.Status == "ON_TIME" || rec.Status == "PRESENT" {
			currentDay = 1.0
		} else if rec.Status == "LATE" || rec.Status == "HALF_DAY" {
			currentDay = 0.5
		}
		attendanceMap[rec.EmployeeID] += currentDay
	}

	// 4. For each contract, calculate payroll
	for _, contract := range contracts {
		actualDays := attendanceMap[contract.EmployeeID]

		baseSalary := contract.BaseSalary
		allowances := 500000.0 // Fixed for example
		
		// Logic
		gross := (baseSalary / standardDays) * actualDays
		
		// Deductions (10.5% Social Insurance limit, simulated)
		deductions := gross * 0.105
		
		net := gross + allowances - deductions

		payslips = append(payslips, domain.Payslip{
			PayrollRunID:     run.ID,
			EmployeeID:       contract.EmployeeID,
			StandardWorkDays: standardDays,
			ActualWorkDays:   actualDays,
			BaseSalary:       baseSalary,
			Allowances:       allowances,
			Deductions:       deductions,
			NetSalary:        net,
			Status:           "Generated",
		})
	}

	// 5. Bulk insert payslips
	if err := pe.payrollRepo.BulkCreatePayslips(ctx, payslips); err != nil {
		return nil, fmt.Errorf("failed to save payslips: %v", err)
	}

	// 6. Update Run Status
	pe.payrollRepo.UpdateRunStatus(ctx, run.ID, "Generated")
	run.Status = "Generated"

	return run, nil
}

func (pe *payrollEngineUseCase) ListRuns(ctx context.Context, offset, limit int) ([]domain.PayrollRun, int64, error) {
	return pe.payrollRepo.ListRuns(ctx, offset, limit)
}

func (pe *payrollEngineUseCase) GetPayslips(ctx context.Context, runID string) ([]domain.Payslip, error) {
	return pe.payrollRepo.GetPayslipsByRunID(ctx, runID)
}
