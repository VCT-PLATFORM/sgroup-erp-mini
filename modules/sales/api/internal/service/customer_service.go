package service

import (
	"context"
	"errors"

	"github.com/vctplatform/sgroup-erp/modules/sales/api/internal/model"
	"github.com/vctplatform/sgroup-erp/modules/sales/api/internal/repository"
)

type CustomerService interface {
	CreateCustomer(ctx context.Context, customer *model.Customer) (*model.Customer, error)
	GetCustomer(ctx context.Context, id string) (*model.Customer, error)
	GetMyCustomers(ctx context.Context, staffID string, page, limit int) ([]model.Customer, int64, error)
	GetTeamCustomers(ctx context.Context, teamID string, page, limit int) ([]model.Customer, int64, error)
}

type customerService struct {
	repo repository.CustomerRepository
}

func NewCustomerService(repo repository.CustomerRepository) CustomerService {
	return &customerService{repo: repo}
}

func (s *customerService) CreateCustomer(ctx context.Context, customer *model.Customer) (*model.Customer, error) {
	if customer.FullName == "" || customer.Phone == "" {
		return nil, errors.New("họ tên và số điện thoại không được để trống")
	}
	if customer.Status == "" {
		customer.Status = "HOT"
	}
	err := s.repo.Create(ctx, customer)
	if err != nil {
		return nil, err
	}
	return customer, nil
}

func (s *customerService) GetCustomer(ctx context.Context, id string) (*model.Customer, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *customerService) GetMyCustomers(ctx context.Context, staffID string, page, limit int) ([]model.Customer, int64, error) {
	return s.repo.FindByAssignedTo(ctx, staffID, page, limit)
}

func (s *customerService) GetTeamCustomers(ctx context.Context, teamID string, page, limit int) ([]model.Customer, int64, error) {
	// For simplicity in this example, we assume repository has a way to find by team, 
	// or we just return an empty slice for now to keep it compiling while expanding capabilities.
	return []model.Customer{}, 0, nil
}
