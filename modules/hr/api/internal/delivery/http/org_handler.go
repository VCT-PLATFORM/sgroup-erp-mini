package http

import (
	"fmt"
	"net/http"
	

	"github.com/gin-gonic/gin"
	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/domain"
	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/usecase"
)

type OrgConfigHandler struct {
	uc usecase.OrgConfigUseCase
}

func NewOrgConfigHandler(router *gin.Engine, uc usecase.OrgConfigUseCase) {
	handler := &OrgConfigHandler{uc: uc}

	hrGroup := router.Group("/api/hr/v1")
	{
		// Departments
		hrGroup.POST("/departments", handler.CreateDepartment)
		hrGroup.GET("/departments", handler.ListDepartments)
		hrGroup.PUT("/departments/:id", handler.UpdateDepartment)
		hrGroup.DELETE("/departments/:id", handler.DeleteDepartment)

		// Teams
		hrGroup.POST("/teams", handler.CreateTeam)
		hrGroup.GET("/teams", handler.ListTeams)
		hrGroup.PUT("/teams/:id", handler.UpdateTeam)
		hrGroup.DELETE("/teams/:id", handler.DeleteTeam)

		// Positions
		hrGroup.POST("/positions", handler.CreatePosition)
		hrGroup.GET("/positions", handler.ListPositions)
		hrGroup.PUT("/positions/:id", handler.UpdatePosition)
		hrGroup.DELETE("/positions/:id", handler.DeletePosition)
	}
}

// -- Departments --
func (h *OrgConfigHandler) CreateDepartment(c *gin.Context) {
	var body domain.Department
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.uc.CreateDepartment(c.Request.Context(), &body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create department: %v", err)})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": body})
}

func (h *OrgConfigHandler) ListDepartments(c *gin.Context) {
	depts, err := h.uc.GetDepartments(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load departments"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": depts})
}

func (h *OrgConfigHandler) UpdateDepartment(c *gin.Context) {
	idStr := c.Param("id")
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.uc.UpdateDepartment(c.Request.Context(), idStr, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update department"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Success"})
}

func (h *OrgConfigHandler) DeleteDepartment(c *gin.Context) {
	idStr := c.Param("id")
	if err := h.uc.DeleteDepartment(c.Request.Context(), idStr); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete department"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Success"})
}

// -- Teams --
func (h *OrgConfigHandler) CreateTeam(c *gin.Context) {
	var body domain.Team
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.uc.CreateTeam(c.Request.Context(), &body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create team: %v", err)})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": body})
}

func (h *OrgConfigHandler) ListTeams(c *gin.Context) {
	var deptID *string
	if d := c.Query("departmentId"); d != "" {
		deptID = &d
	}
	teams, err := h.uc.GetTeams(c.Request.Context(), deptID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load teams"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": teams})
}

func (h *OrgConfigHandler) UpdateTeam(c *gin.Context) {
	idStr := c.Param("id")
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.uc.UpdateTeam(c.Request.Context(), idStr, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update team"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Success"})
}

func (h *OrgConfigHandler) DeleteTeam(c *gin.Context) {
	idStr := c.Param("id")
	if err := h.uc.DeleteTeam(c.Request.Context(), idStr); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete team"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Success"})
}

// -- Positions --
func (h *OrgConfigHandler) CreatePosition(c *gin.Context) {
	var body domain.Position
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.uc.CreatePosition(c.Request.Context(), &body); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to create position: %v", err)})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": body})
}

func (h *OrgConfigHandler) ListPositions(c *gin.Context) {
	positions, err := h.uc.GetPositions(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load positions"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": positions})
}

func (h *OrgConfigHandler) UpdatePosition(c *gin.Context) {
	idStr := c.Param("id")
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.uc.UpdatePosition(c.Request.Context(), idStr, updates); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update position"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Success"})
}

func (h *OrgConfigHandler) DeletePosition(c *gin.Context) {
	idStr := c.Param("id")
	if err := h.uc.DeletePosition(c.Request.Context(), idStr); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete position"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Success"})
}
