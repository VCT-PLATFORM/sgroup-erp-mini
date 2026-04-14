package model

import (
	"time"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type ProductStatus string

const (
	ProductStatusAvailable      ProductStatus = "AVAILABLE"
	ProductStatusLocked         ProductStatus = "LOCKED"
	ProductStatusReserved       ProductStatus = "RESERVED"
	ProductStatusPendingDeposit ProductStatus = "PENDING_DEPOSIT"
	ProductStatusDeposit        ProductStatus = "DEPOSIT"
	ProductStatusSold           ProductStatus = "SOLD"
	ProductStatusCompleted      ProductStatus = "COMPLETED"
)

type Product struct {
	ID            string         `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	ProjectID     string         `gorm:"type:uuid;not null;index:idx_project_status;index:idx_project_block" json:"projectId"`
	Code          string         `gorm:"type:varchar(50);uniqueIndex;not null" json:"code"`
	Block         string         `gorm:"type:varchar(50);index:idx_project_block" json:"block"`
	Floor         int            `gorm:"type:integer" json:"floor"`
	Area          float64        `gorm:"type:decimal(10,2);index" json:"area"`
	Price         float64        `gorm:"type:decimal(18,4);index" json:"price"`
	CommissionAmt float64        `gorm:"type:decimal(18,4);default:0" json:"commissionAmt"`
	BonusAmt      float64        `gorm:"type:decimal(18,4);default:0" json:"bonusAmt"`
	Direction     string         `gorm:"type:varchar(50)" json:"direction"`
	Bedrooms      int            `gorm:"type:integer" json:"bedrooms"`
	UnitType      string         `gorm:"type:varchar(50)" json:"unitType"`
	ViewDesc      string         `gorm:"type:varchar(255)" json:"viewDesc"`
	Status        ProductStatus  `gorm:"type:varchar(30);default:'AVAILABLE';index:idx_project_status" json:"status"`
	BookedBy      *string        `gorm:"type:varchar(255)" json:"bookedBy"`
	LockedUntil   *time.Time     `json:"lockedUntil"`
	CustomerName  *string        `gorm:"type:varchar(255)" json:"customerName"`
	CustomerPhone *string        `gorm:"type:varchar(20)" json:"customerPhone"`
	SalespersonID *string        `gorm:"type:varchar(100)" json:"salespersonId"`
	CreatedAt     time.Time      `gorm:"autoCreateTime" json:"createdAt"`
	UpdatedAt     time.Time      `gorm:"autoUpdateTime" json:"updatedAt"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	Project       *Project       `gorm:"foreignKey:ProjectID" json:"project,omitempty"`
}

func (p *Product) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == "" {
		uuidV7, err := uuid.NewV7()
		if err != nil {
			return err
		}
		p.ID = uuidV7.String()
	}
	return
}
