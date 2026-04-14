package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/vctplatform/sgroup-erp/modules/sales/api/internal/middleware"
	"github.com/vctplatform/sgroup-erp/modules/sales/api/internal/model"
	"github.com/vctplatform/sgroup-erp/modules/sales/api/internal/service"
)

type CustomerHandler struct {
	customerSvc service.CustomerService
}

func NewCustomerHandler(customerSvc service.CustomerService) *CustomerHandler {
	return &CustomerHandler{customerSvc: customerSvc}
}

func (h *CustomerHandler) RegisterRoutes(r *gin.RouterGroup) {
	customerRoutes := r.Group("/customers")
	customerRoutes.Use(middleware.AuthMiddleware())
	{
		staff := customerRoutes.Group("")
		staff.Use(middleware.RoleGuard("sales_staff", "sales_manager", "admin"))
		{
			staff.POST("", h.CreateCustomer)
			staff.GET("/me", h.ListMyCustomers)
		}
	}
}

func (h *CustomerHandler) CreateCustomer(c *gin.Context) {
	var req model.Customer
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}

	userID, _ := c.Get("userID")
	// If the user didn't assign anyone, auto-assign to the creator (sales staff)
	if req.AssignedTo == "" {
		req.AssignedTo = userID.(string)
	}

	created, err := h.customerSvc.CreateCustomer(c.Request.Context(), &req)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusCreated, wrapper{Data: created})
}

func (h *CustomerHandler) ListMyCustomers(c *gin.Context) {
	userID, _ := c.Get("userID")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	customers, total, err := h.customerSvc.GetMyCustomers(c.Request.Context(), userID.(string), page, limit)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: customers, Meta: map[string]interface{}{"total": total, "page": page}})
}
