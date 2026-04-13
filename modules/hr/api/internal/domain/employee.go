package domain

import (
	"time"
)

// Employee represents a person working for the company.
type Employee struct {
	ID           string       `gorm:"primaryKey" json:"id"`
	Code         string     `gorm:"size:50;uniqueIndex;not null" json:"code"` // Employee Code (Mã nhân viên)
	FirstName        string     `gorm:"size:100;not null" json:"first_name"`
	LastName         string     `gorm:"size:100;not null" json:"last_name"`
	FullName         string     `gorm:"size:200" json:"full_name"`
	EnglishName      string     `gorm:"size:200" json:"english_name"` // Added
	Email            string     `gorm:"size:255;uniqueIndex;not null" json:"email"`
	Phone            string     `gorm:"size:50" json:"phone"`
	RelativePhone    string     `gorm:"size:50" json:"relative_phone"` // Added
	IdentityCard     string     `gorm:"size:50;uniqueIndex" json:"identity_card"` // CMND/CCCD
	IdIssueDate      *time.Time `json:"id_issue_date"` // Added
	IdIssuePlace     string     `gorm:"size:255" json:"id_issue_place"` // Added
	VnId             string     `gorm:"size:50" json:"vn_id"` // Added (Mã định danh VN)
	DateOfBirth      *time.Time `json:"date_of_birth"`
	Gender           string     `gorm:"size:10" json:"gender"` // Male, Female, Other
	Address          string     `gorm:"type:text" json:"address"` // Current Address
	PermanentAddress string     `gorm:"type:text" json:"permanent_address"` // Added
	ContactAddress   string     `gorm:"type:text" json:"contact_address"` // Added
	AvatarURL        string     `gorm:"size:500" json:"avatar_url"`

	// Tax & Insurance & Bank (Added)
	TaxCode             string `gorm:"size:50" json:"tax_code"`
	InsuranceBookNumber string `gorm:"size:50" json:"insurance_book_number"`
	BankName            string `gorm:"size:100" json:"bank_name"`
	BankAccount         string `gorm:"size:100" json:"bank_account"`

	// Job Information
	DepartmentID *string       `json:"department_id"`
	Department   *Department `gorm:"foreignKey:DepartmentID" json:"department,omitempty"`
	TeamID       *string       `json:"team_id"` // Added
	Team         *Team       `gorm:"foreignKey:TeamID" json:"team,omitempty"` // Added
	PositionID   *string       `json:"position_id"`
	Position     *Position   `gorm:"foreignKey:PositionID" json:"position,omitempty"`

	// Status (e.g., Active, OnLeave, Terminated)
	Status    string     `gorm:"size:50;default:'Active'" json:"status"`
	JoinDate  *time.Time `json:"join_date"`
	LeaveDate *time.Time `json:"leave_date"`

	// Manager
	ManagerID *string     `json:"manager_id"`
	Manager   *Employee `gorm:"foreignKey:ManagerID" json:"manager,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// TableName overrides the table name
func (Employee) TableName() string {
	return "hr_employees"
}
