package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SalesStaff struct {
	ID             string     `gorm:"type:uuid;primaryKey" json:"id"`
	HREmployeeID   *string    `gorm:"type:varchar(100)" json:"hrEmployeeId"`
	EmployeeCode   string     `gorm:"type:varchar(50);uniqueIndex" json:"employeeCode"`
	FullName       string     `gorm:"type:varchar(100)" json:"fullName"`
	Phone          string     `gorm:"type:varchar(20)" json:"phone"`
	Email          string     `gorm:"type:varchar(100)" json:"email"`
	Role           string     `gorm:"type:varchar(50)" json:"role"`
	Status         string     `gorm:"type:varchar(20);default:'ACTIVE'" json:"status"`
	LeadsCapacity  int        `gorm:"default:30" json:"leadsCapacity"`
	PersonalTarget float64    `gorm:"type:decimal(15,2);default:0" json:"personalTarget"`
	TeamID         *string    `gorm:"type:uuid" json:"teamId"`
	Team           *SalesTeam `gorm:"foreignKey:TeamID" json:"team"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
}

func (s *SalesStaff) BeforeCreate(tx *gorm.DB) error {
	v7, err := uuid.NewV7()
	if err != nil {
		return err
	}
	s.ID = v7.String()
	return nil
}

type DimProject struct {
	ID         string  `gorm:"type:uuid;primaryKey" json:"id"`
	Name       string  `gorm:"type:varchar(200)" json:"name"`
	Developer  string  `gorm:"type:varchar(200)" json:"developer"`
	Location   string  `gorm:"type:varchar(255)" json:"location"`
	Type       string  `gorm:"type:varchar(50)" json:"type"`
	FeeRate    float64 `gorm:"type:decimal(5,2)" json:"feeRate"`
	AvgPrice   float64 `gorm:"type:decimal(15,2)" json:"avgPrice"`
	TotalUnits int     `gorm:"default:0" json:"totalUnits"`
	SoldUnits  int     `gorm:"default:0" json:"soldUnits"`
	Status     string  `gorm:"type:varchar(20);default:'ACTIVE'" json:"status"`
}

func (p *DimProject) BeforeCreate(tx *gorm.DB) error {
	v7, err := uuid.NewV7()
	if err != nil {
		return err
	}
	p.ID = v7.String()
	return nil
}

type SalesDeal struct {
	ID            string    `gorm:"type:uuid;primaryKey" json:"id"`
	DealCode      string    `gorm:"type:varchar(50);uniqueIndex" json:"dealCode"`
	ProjectID     *string   `gorm:"type:uuid" json:"projectId"`
	ProjectName   string    `gorm:"type:varchar(200)" json:"projectName"`
	StaffID       *string   `gorm:"type:uuid" json:"staffId"`
	StaffName     string    `gorm:"type:varchar(100)" json:"staffName"`
	TeamID        *string   `gorm:"type:uuid" json:"teamId"`
	TeamName      string    `gorm:"type:varchar(100)" json:"teamName"`
	CustomerName  string    `gorm:"type:varchar(100)" json:"customerName"`
	CustomerPhone string    `gorm:"type:varchar(20)" json:"customerPhone"`
	ProductCode   string    `gorm:"type:varchar(50)" json:"productCode"`
	ProductType   string    `gorm:"type:varchar(50)" json:"productType"`
	DealValue     float64   `gorm:"type:decimal(15,2)" json:"dealValue"`
	FeeRate       float64   `gorm:"type:decimal(5,2)" json:"feeRate"`
	Commission    float64   `gorm:"type:decimal(15,2)" json:"commission"`
	Source        string    `gorm:"type:varchar(50)" json:"source"`
	Year          int       `gorm:"index" json:"year"`
	Month         int       `gorm:"index" json:"month"`
	Stage         string    `gorm:"type:varchar(50)" json:"stage"`
	Note          string    `gorm:"type:text" json:"note"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

func (d *SalesDeal) BeforeCreate(tx *gorm.DB) error {
	v7, err := uuid.NewV7()
	if err != nil {
		return err
	}
	d.ID = v7.String()
	return nil
}

type SalesBooking struct {
	ID               string    `gorm:"type:uuid;primaryKey" json:"id"`
	ProjectID        string    `gorm:"type:uuid" json:"projectId"`
	ProjectName      string    `gorm:"type:varchar(200)" json:"projectName"`
	CustomerName     string    `gorm:"type:varchar(100)" json:"customerName"`
	CustomerPhone    string    `gorm:"type:varchar(20)" json:"customerPhone"`
	BookingAmount    float64   `gorm:"type:decimal(15,2)" json:"bookingAmount"`
	BookingCount     int       `gorm:"default:1" json:"bookingCount"`
	StaffID          *string   `gorm:"type:uuid" json:"staffId"`
	StaffName        *string   `gorm:"type:varchar(100)" json:"staffName"`
	TeamID           *string   `gorm:"type:uuid" json:"teamId"`
	TeamName         *string   `gorm:"type:varchar(100)" json:"teamName"`
	Status           string    `gorm:"type:varchar(50);default:'PENDING'" json:"status"`
	BookingDate      time.Time `json:"bookingDate"`
	Note             *string   `gorm:"type:text" json:"note"`
	CreatedByUserID  *string   `gorm:"type:varchar(100)" json:"createdByUserId"`
	CreatedByName    *string   `gorm:"type:varchar(100)" json:"createdByName"`
	ReviewedByUserID *string   `gorm:"type:varchar(100)" json:"reviewedByUserId"`
	ReviewedByName   *string   `gorm:"type:varchar(100)" json:"reviewedByName"`
	ReviewedAt       *time.Time `json:"reviewedAt"`
	Year             int       `gorm:"index" json:"year"`
	Month            int       `gorm:"index" json:"month"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

func (b *SalesBooking) BeforeCreate(tx *gorm.DB) error {
	v7, err := uuid.NewV7()
	if err != nil {
		return err
	}
	b.ID = v7.String()
	return nil
}

type SalesDeposit struct {
	ID               string    `gorm:"type:uuid;primaryKey" json:"id"`
	ProjectID        string    `gorm:"type:uuid" json:"projectId"`
	ProjectName      string    `gorm:"type:varchar(200)" json:"projectName"`
	UnitCode         string    `gorm:"type:varchar(50)" json:"unitCode"`
	CustomerName     string    `gorm:"type:varchar(100)" json:"customerName"`
	CustomerPhone    string    `gorm:"type:varchar(20)" json:"customerPhone"`
	DepositAmount    float64   `gorm:"type:decimal(15,2)" json:"depositAmount"`
	StaffID          *string   `gorm:"type:uuid" json:"staffId"`
	StaffName        *string   `gorm:"type:varchar(100)" json:"staffName"`
	TeamID           *string   `gorm:"type:uuid" json:"teamId"`
	TeamName         *string   `gorm:"type:varchar(100)" json:"teamName"`
	PaymentMethod    *string   `gorm:"type:varchar(50)" json:"paymentMethod"`
	ReceiptNo        *string   `gorm:"type:varchar(50)" json:"receiptNo"`
	Notes            *string   `gorm:"type:text" json:"notes"`
	Status           string    `gorm:"type:varchar(50);default:'PENDING'" json:"status"`
	DepositDate      time.Time `json:"depositDate"`
	CreatedByUserID  *string   `gorm:"type:varchar(100)" json:"createdByUserId"`
	CreatedByName    *string   `gorm:"type:varchar(100)" json:"createdByName"`
	ReviewedByUserID *string   `gorm:"type:varchar(100)" json:"reviewedByUserId"`
	ReviewedByName   *string   `gorm:"type:varchar(100)" json:"reviewedByName"`
	ReviewedAt       *time.Time `json:"reviewedAt"`
	Year             int       `gorm:"index" json:"year"`
	Month            int       `gorm:"index" json:"month"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
	CreatedAt        time.Time `json:"createdAt"`
	UpdatedAt        time.Time `json:"updatedAt"`
}

func (d *SalesDeposit) BeforeCreate(tx *gorm.DB) error {
	v7, err := uuid.NewV7()
	if err != nil {
		return err
	}
	d.ID = v7.String()
	return nil
}

type SalesTarget struct {
	ID             string    `gorm:"type:uuid;primaryKey" json:"id"`
	Year           int       `gorm:"index" json:"year"`
	Month          int       `gorm:"index" json:"month"`
	TeamID         string    `gorm:"type:uuid;index" json:"teamId"`
	StaffID        string    `gorm:"type:uuid;index" json:"staffId"`
	ScenarioKey    string    `gorm:"type:varchar(50)" json:"scenarioKey"`
	TargetGMV      float64   `gorm:"type:decimal(15,2)" json:"targetGMV"`
	TargetDeals    int       `json:"targetDeals"`
	TargetLeads    int       `json:"targetLeads"`
	TargetMeetings int       `json:"targetMeetings"`
	TargetBookings int       `json:"targetBookings"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

func (t *SalesTarget) BeforeCreate(tx *gorm.DB) error {
	v7, err := uuid.NewV7()
	if err != nil {
		return err
	}
	t.ID = v7.String()
	return nil
}
