package http

import (
	"strconv"
	"fmt"
	"net/http"
	

	"github.com/gin-gonic/gin"
	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/domain"
	"github.com/vctplatform/sgroup-erp/modules/hr/api/internal/usecase"
)

type LeaveHandler struct {
	uc usecase.LeaveUseCase
}

func NewLeaveHandler(router *gin.Engine, uc usecase.LeaveUseCase) {
	handler := &LeaveHandler{uc: uc}

	hrGroup := router.Group("/api/hr/v1")
	{
		hrGroup.POST("/leaves", handler.SubmitRequest)
		hrGroup.GET("/leaves", handler.ListRequests)
		hrGroup.PUT("/leaves/:id/approve", handler.ApproveRequest)
		hrGroup.PUT("/leaves/:id/reject", handler.RejectRequest)
		hrGroup.GET("/leaves/balances/:employee_id", handler.GetBalance)
	}
}

func (h *LeaveHandler) SubmitRequest(c *gin.Context) {
	fmt.Println("LeaveHandler SubmitRequest endpoint hit")
	var req domain.LeaveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "message": err.Error()})
		return
	}

	if err := h.uc.SubmitRequest(c.Request.Context(), &req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit leave request", "message": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Leave request submitted", "data": req})
}

func (h *LeaveHandler) ApproveRequest(c *gin.Context) {
	idStr := c.Param("id")

	var payload struct {
		ApproverID string `json:"approver_id"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "message": err.Error()})
		return
	}

	if err := h.uc.ApproveRequest(c.Request.Context(), idStr, payload.ApproverID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve leave request", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Leave request approved"})
}

func (h *LeaveHandler) RejectRequest(c *gin.Context) {
	idStr := c.Param("id")

	var payload struct {
		ApproverID string `json:"approver_id"`
		Note       string `json:"note"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "message": err.Error()})
		return
	}

	if err := h.uc.RejectRequest(c.Request.Context(), idStr, payload.ApproverID, payload.Note); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reject leave request", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Leave request rejected"})
}

func (h *LeaveHandler) ListRequests(c *gin.Context) {
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	
	empIDStr := c.Query("employee_id")
	var empID *string
	if empIDStr != "" {
		empID = &empIDStr
	}

	statusStr := c.Query("status")
	var status *string
	if statusStr != "" {
		status = &statusStr
	}

	requests, total, err := h.uc.ListRequests(c.Request.Context(), offset, limit, empID, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to list leave requests", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": requests, "total": total, "offset": offset, "limit": limit})
}

func (h *LeaveHandler) GetBalance(c *gin.Context) {
	empIDStr := c.Param("employee_id")
	yearStr := c.Query("year")

	year, err := strconv.Atoi(yearStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid year"})
		return
	}

	balance, err := h.uc.GetBalance(c.Request.Context(), empIDStr, year)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get leave balance", "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": balance})
}
