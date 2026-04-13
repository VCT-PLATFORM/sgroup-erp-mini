package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type LegalDocStatus string

const (
	LegalDocStatusPreparation  LegalDocStatus = "PREPARATION"
	LegalDocStatusSubmitted    LegalDocStatus = "SUBMITTED"
	LegalDocStatusIssueFixing  LegalDocStatus = "ISSUE_FIXING"
	LegalDocStatusApproved     LegalDocStatus = "APPROVED"
)

type LegalDoc struct {
	ID           string         `gorm:"type:uuid;primaryKey" json:"id"`
	ProjectID    string         `gorm:"type:uuid;not null;index" json:"projectId"`
	Title        string         `gorm:"type:varchar(255);not null" json:"title"`
	Description  string         `gorm:"type:text" json:"description"`
	DocType      string         `gorm:"type:varchar(50)" json:"docType"` // e.g. 1/500, GPXD
	Status       LegalDocStatus `gorm:"type:varchar(30);default:'PREPARATION'" json:"status"`
	FileURL      string         `gorm:"type:varchar(500)" json:"fileUrl"`
	UploadedBy   string         `gorm:"type:varchar(100)" json:"uploadedBy"`
	AssigneeName *string        `gorm:"type:varchar(255)" json:"assigneeName"`
	SubmitDate   *time.Time     `json:"submitDate"`
	ApproveDate  *time.Time     `json:"approveDate"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

func (d *LegalDoc) BeforeCreate(tx *gorm.DB) error {
	if d.ID == "" {
		v7, err := uuid.NewV7()
		if err != nil {
			return err
		}
		d.ID = v7.String()
	}
	return nil
}
