package usecase

import (
	"context"

	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/domain"
	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/repository"
)

type OrgConfigUseCase interface {
	// Department
	CreateDepartment(ctx context.Context, dept *domain.Department) error
	GetDepartments(ctx context.Context) ([]domain.Department, error)
	UpdateDepartment(ctx context.Context, id string, updates map[string]interface{}) error
	DeleteDepartment(ctx context.Context, id string) error

	// Team
	CreateTeam(ctx context.Context, team *domain.Team) error
	GetTeams(ctx context.Context, deptID *string) ([]domain.Team, error)
	UpdateTeam(ctx context.Context, id string, updates map[string]interface{}) error
	DeleteTeam(ctx context.Context, id string) error

	// Position
	CreatePosition(ctx context.Context, pos *domain.Position) error
	GetPositions(ctx context.Context) ([]domain.Position, error)
	UpdatePosition(ctx context.Context, id string, updates map[string]interface{}) error
	DeletePosition(ctx context.Context, id string) error
}

type orgConfigUseCase struct {
	deptRepo repository.DepartmentRepository
	teamRepo repository.TeamRepository
	posRepo  repository.PositionRepository
}

func NewOrgConfigUseCase(dr repository.DepartmentRepository, tr repository.TeamRepository, pr repository.PositionRepository) OrgConfigUseCase {
	return &orgConfigUseCase{
		deptRepo: dr,
		teamRepo: tr,
		posRepo:  pr,
	}
}

// -- Departments --

func (u *orgConfigUseCase) CreateDepartment(ctx context.Context, dept *domain.Department) error {
	return u.deptRepo.Create(ctx, dept)
}

func (u *orgConfigUseCase) GetDepartments(ctx context.Context) ([]domain.Department, error) {
	return u.deptRepo.List(ctx)
}

func (u *orgConfigUseCase) UpdateDepartment(ctx context.Context, id string, updates map[string]interface{}) error {
	return u.deptRepo.Update(ctx, id, updates)
}

func (u *orgConfigUseCase) DeleteDepartment(ctx context.Context, id string) error {
	return u.deptRepo.Delete(ctx, id)
}

// -- Teams --

func (u *orgConfigUseCase) CreateTeam(ctx context.Context, team *domain.Team) error {
	return u.teamRepo.Create(ctx, team)
}

func (u *orgConfigUseCase) GetTeams(ctx context.Context, deptID *string) ([]domain.Team, error) {
	return u.teamRepo.List(ctx, deptID)
}

func (u *orgConfigUseCase) UpdateTeam(ctx context.Context, id string, updates map[string]interface{}) error {
	return u.teamRepo.Update(ctx, id, updates)
}

func (u *orgConfigUseCase) DeleteTeam(ctx context.Context, id string) error {
	return u.teamRepo.Delete(ctx, id)
}

// -- Positions --

func (u *orgConfigUseCase) CreatePosition(ctx context.Context, pos *domain.Position) error {
	return u.posRepo.Create(ctx, pos)
}

func (u *orgConfigUseCase) GetPositions(ctx context.Context) ([]domain.Position, error) {
	return u.posRepo.List(ctx)
}

func (u *orgConfigUseCase) UpdatePosition(ctx context.Context, id string, updates map[string]interface{}) error {
	return u.posRepo.Update(ctx, id, updates)
}

func (u *orgConfigUseCase) DeletePosition(ctx context.Context, id string) error {
	return u.posRepo.Delete(ctx, id)
}
