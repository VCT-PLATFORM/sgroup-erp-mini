package domain

import (
	"time"
)

// LeaveRequest represents an employee's application for taking time off.
type LeaveRequest struct {
	ID           string       `gorm:"primaryKey" json:"id"`
	EmployeeID   string       `json:"employee_id"`
	Employee     *Employee  `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
	LeaveType    string     `gorm:"size:50;not null" json:"leave_type"` // e.g., ANNUAL, SICK, UNPAID, MATERNITY
	StartDate    time.Time  `gorm:"type:date;not null" json:"start_date"`
	EndDate      time.Time  `gorm:"type:date;not null" json:"end_date"`
	TotalDays    float64    `gorm:"type:decimal(4,1);not null" json:"total_days"`
	Reason       string     `gorm:"type:text" json:"reason"`
	Status       string     `gorm:"size:30;default:'PENDING'" json:"status"` // PENDING, APPROVED, REJECTED
	ApprovedByID *string      `json:"approved_by_id"`
	ApprovedBy   *Employee  `gorm:"foreignKey:ApprovedByID" json:"approved_by,omitempty"`
	ApprovedAt   *time.Time `json:"approved_at"`
	RejectionNote string    `gorm:"type:text" json:"rejection_note"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// TableName overrides the table name
func (LeaveRequest) TableName() string {
	return "hr_leave_requests"
}

// LeaveBalance tracks the remaining leave days for an employee per year.
type LeaveBalance struct {
	ID          string      `gorm:"primaryKey" json:"id"`
	EmployeeID  string      `json:"employee_id"`
	Employee    *Employee `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
	Year        int       `gorm:"not null;uniqueIndex:idx_emp_year" json:"year"`
	AnnualTotal float64   `gorm:"type:decimal(4,1);default:12" json:"annual_total"`
	AnnualUsed  float64   `gorm:"type:decimal(4,1);default:0" json:"annual_used"`
	SickTotal   float64   `gorm:"type:decimal(4,1);default:30" json:"sick_total"`
	SickUsed    float64   `gorm:"type:decimal(4,1);default:0" json:"sick_used"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// TableName overrides the table name
func (LeaveBalance) TableName() string {
	return "hr_leave_balances"
}
