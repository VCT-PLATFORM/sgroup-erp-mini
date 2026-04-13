package http

import (
	"strconv"
	"fmt"
	"net/http"
	

	"github.com/gin-gonic/gin"
	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/usecase"
)

type AttendanceHandler struct {
	uc usecase.AttendanceUseCase
}

func NewAttendanceHandler(router *gin.Engine, uc usecase.AttendanceUseCase) {
	handler := &AttendanceHandler{uc: uc}

	hrGroup := router.Group("/api/hr/v1")
	{
		hrGroup.POST("/attendance/check-in", handler.CheckIn)
		hrGroup.POST("/attendance/check-out", handler.CheckOut)
		hrGroup.GET("/attendance", handler.List)
	}
}

func (h *AttendanceHandler) CheckIn(c *gin.Context) {
	fmt.Println("AttendanceHandler CheckIn endpoint hit")
	var req struct {
		EmployeeID string   `json:"employee_id"`
		Remarks    string `json:"remarks"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "message": err.Error()})
		return
	}

	record, err := h.uc.CheckIn(c.Request.Context(), req.EmployeeID, req.Remarks)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check in", "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Checked in successfully", "data": record})
}

func (h *AttendanceHandler) CheckOut(c *gin.Context) {
	var req struct {
		EmployeeID string   `json:"employee_id"`
		Remarks    string `json:"remarks"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "message": err.Error()})
		return
	}

	record, err := h.uc.CheckOut(c.Request.Context(), req.EmployeeID, req.Remarks)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check out", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Checked out successfully", "data": record})
}

func (h *AttendanceHandler) List(c *gin.Context) {
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	empIDStr := c.Query("employee_id")
	startDate := c.Query("start_date")
	endDate := c.Query("end_date")

	var empID *string
	if empIDStr != "" {
		empIDVal := empIDStr
		empID = &empIDVal
	}

	var sd, ed *string
	if startDate != "" {
		sd = &startDate
	}
	if endDate != "" {
		ed = &endDate
	}

	records, total, err := h.uc.List(c.Request.Context(), offset, limit, empID, sd, ed)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list attendance records", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": records, "total": total, "offset": offset, "limit": limit})
}
