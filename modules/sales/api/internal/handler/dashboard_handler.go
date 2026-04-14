package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/vctplatform/sgroup-erp/modules/sales/api/internal/middleware"
)

type DashboardHandler struct {
}

func NewDashboardHandler() *DashboardHandler {
	return &DashboardHandler{}
}

func (h *DashboardHandler) RegisterRoutes(r *gin.RouterGroup) {
	dashRoutes := r.Group("/dashboard")
	dashRoutes.Use(middleware.AuthMiddleware())
	{
		dashRoutes.GET("/kpi", h.GetKPIs)
	}
}

func (h *DashboardHandler) GetKPIs(c *gin.Context) {
	// Mock KPI response based on role
	role, exists := c.Get("role")
	var r string
	if exists {
		r = role.(string)
	}

	data := map[string]interface{}{
		"totalLeads":       120,
		"conversionRate":   15.5,
		"revenue":          5000000000,
		"pipelineValue":    12000000000,
		"pendingApprovals": 3,
	}

	if r == "sales_director" {
		data["totalLeads"] = 1500
		data["revenue"] = 45000000000
		data["pendingApprovals"] = 12
	} else if r == "sales_manager" {
		data["totalLeads"] = 450
		data["revenue"] = 15000000000
		data["pendingApprovals"] = 8
	}

	c.JSON(http.StatusOK, wrapper{Data: data})
}
