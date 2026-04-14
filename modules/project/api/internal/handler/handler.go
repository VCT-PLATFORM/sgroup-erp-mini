package handler

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/middleware"
	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/model"
	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/repository"
	"github.com/vctplatform/sgroup-erp/modules/project/api/internal/service"
)

type wrapper struct {
	Data interface{} `json:"data"`
	Meta interface{} `json:"meta,omitempty"`
}

type errorWrapper struct {
	Error struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
}

func sendError(c *gin.Context, code int, message string) {
	c.JSON(code, errorWrapper{
		Error: struct {
			Code    int    `json:"code"`
			Message string `json:"message"`
		}{Code: code, Message: message},
	})
}

type ProjectHandler struct {
	projectSvc service.ProjectService
	productSvc service.ProductService
	docSvc     service.DocService
}

func NewProjectHandler(projectSvc service.ProjectService, productSvc service.ProductService, docSvc service.DocService) *ProjectHandler {
	return &ProjectHandler{projectSvc: projectSvc, productSvc: productSvc, docSvc: docSvc}
}

func (h *ProjectHandler) RegisterRoutes(r *gin.RouterGroup) {
	// Public GET routes
	projects := r.Group("/projects")
	{
		projects.GET("", h.ListProjects)
		projects.GET("/:id", h.GetProject)
		projects.GET("/:id/products", h.ListProducts)
		projects.GET("/:id/products/breakdown", h.GetStatusBreakdown)
		projects.GET("/:id/docs", h.ListDocs)

		// Protected - requires admin/project_manager role
		protectedPj := projects.Group("")
		protectedPj.Use(middleware.AuthMiddleware())
		protectedPj.Use(middleware.RoleGuard("admin", "project_manager"))
		{
			protectedPj.POST("", h.CreateProject)
			protectedPj.PUT("/:id", h.UpdateProject)
			protectedPj.DELETE("/:id", h.DeleteProject)
			protectedPj.POST("/:id/products", h.CreateProduct)
			protectedPj.POST("/:id/products/batch", h.BatchCreateProducts)
			protectedPj.POST("/:id/docs", h.UploadDoc)
			protectedPj.PUT("/:id/docs/:docId/status", h.UpdateDocStatus)
			protectedPj.DELETE("/:id/docs/:docId", h.DeleteDoc)
		}
	}

	// Product actions
	products := r.Group("/products")
	{
		protectedPd := products.Group("")
		protectedPd.Use(middleware.AuthMiddleware())
		{
			protectedPd.POST("/:id/lock", h.LockProduct)
			protectedPd.POST("/:id/unlock", h.UnlockProduct)
			protectedPd.POST("/bulk-lock", h.BulkLockProducts)
			protectedPd.POST("/bulk-unlock", h.BulkUnlockProducts)
			protectedPd.POST("/:id/deposit", h.DepositProduct)
			protectedPd.POST("/:id/sold", h.SoldProduct)
			protectedPd.PUT("/:id", h.UpdateProduct)
		}

		adminPd := products.Group("")
		adminPd.Use(middleware.AuthMiddleware())
		adminPd.Use(middleware.RoleGuard("admin"))
		{
			adminPd.DELETE("/:id", h.DeleteProduct)
		}
	}

	// Dashboard
	dashboard := r.Group("/dashboard")
	{
		dashboard.GET("/stats", h.GetDashboardStats)
		dashboard.GET("/breakdown", h.GetTotalStatusBreakdown)
	}
}

// ==================== PROJECT ENDPOINTS ====================

func (h *ProjectHandler) ListProjects(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	search := c.Query("search")

	projects, total, err := h.projectSvc.ListProjects(c.Request.Context(), page, limit, search)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, wrapper{
		Data: projects,
		Meta: map[string]interface{}{
			"total": total,
			"page":  page,
			"limit": limit,
		},
	})
}

func (h *ProjectHandler) CreateProject(c *gin.Context) {
	var req model.Project
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}

	created, err := h.projectSvc.CreateProject(c.Request.Context(), &req)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusCreated, wrapper{Data: created})
}

func (h *ProjectHandler) GetProject(c *gin.Context) {
	id := c.Param("id")
	project, err := h.projectSvc.GetProject(c.Request.Context(), id)
	if err != nil {
		sendError(c, http.StatusNotFound, "Project not found")
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: project})
}

func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}
	id := c.Param("id")

	updated, err := h.projectSvc.UpdateProject(c.Request.Context(), id, req)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: updated})
}

func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	id := c.Param("id")
	err := h.projectSvc.DeleteProject(c.Request.Context(), id)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: map[string]string{"message": "Deleted successfully"}})
}

// ==================== PRODUCT ENDPOINTS ====================

func (h *ProjectHandler) ListProducts(c *gin.Context) {
	projectID := c.Param("id")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))

	// Check if filters are provided
	status := c.Query("status")
	block := c.Query("block")
	search := c.Query("search")
	sort := c.Query("sort")
	minPrice, _ := strconv.ParseFloat(c.Query("minPrice"), 64)
	maxPrice, _ := strconv.ParseFloat(c.Query("maxPrice"), 64)
	bedrooms, _ := strconv.Atoi(c.Query("bedrooms"))

	hasFilters := status != "" || block != "" || search != "" || sort != "" || minPrice > 0 || maxPrice > 0 || bedrooms > 0

	var products []model.Product
	var total int64
	var err error

	if hasFilters {
		filters := repository.ProductFilters{
			Status:   status,
			Block:    block,
			Search:   search,
			Sort:     sort,
			MinPrice: minPrice,
			MaxPrice: maxPrice,
			Bedrooms: bedrooms,
		}
		products, total, err = h.productSvc.ListProjectProductsFiltered(c.Request.Context(), projectID, page, limit, filters)
	} else {
		products, total, err = h.productSvc.ListProjectProducts(c.Request.Context(), projectID, page, limit)
	}

	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, wrapper{
		Data: products,
		Meta: map[string]interface{}{
			"total": total,
			"page":  page,
			"limit": limit,
		},
	})
}

func (h *ProjectHandler) CreateProduct(c *gin.Context) {
	var req model.Product
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}
	req.ProjectID = c.Param("id")

	created, err := h.productSvc.CreateProduct(c.Request.Context(), &req)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Trigger sync project units
	go h.projectSvc.SyncProjectUnits(context.Background(), req.ProjectID)

	c.JSON(http.StatusCreated, wrapper{Data: created})
}

// BatchCreateProducts handles bulk product import for Excel uploads.
func (h *ProjectHandler) BatchCreateProducts(c *gin.Context) {
	projectID := c.Param("id")
	var products []model.Product
	if err := c.ShouldBindJSON(&products); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}

	count, err := h.productSvc.BatchCreateProducts(c.Request.Context(), projectID, products)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Sync project units after batch import
	go h.projectSvc.SyncProjectUnits(context.Background(), projectID)

	c.JSON(http.StatusCreated, wrapper{
		Data: map[string]interface{}{
			"created": count,
			"message": "Batch import completed",
		},
	})
}

func (h *ProjectHandler) UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}

	updated, err := h.productSvc.UpdateProduct(c.Request.Context(), id, req)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, wrapper{Data: updated})
}

// ==================== PRODUCT STATUS ACTIONS ====================

type LockProductRequest struct {
	BookedBy      string `json:"bookedBy" binding:"required"`
	CustomerName  string `json:"customerName" binding:"required"`
	CustomerPhone string `json:"customerPhone" binding:"required"`
}

func (h *ProjectHandler) LockProduct(c *gin.Context) {
	id := c.Param("id")
	var req LockProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}

	err := h.productSvc.LockProduct(c.Request.Context(), id, req.BookedBy, req.CustomerName, req.CustomerPhone, 24) // 24 hours lock
	if err != nil {
		sendError(c, http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: map[string]string{"message": "Product locked successfully"}})
}

type BulkLockProductRequest struct {
	ProductIDs    []string `json:"productIds" binding:"required,min=1"`
	BookedBy      string   `json:"bookedBy" binding:"required"`
	CustomerName  string   `json:"customerName" binding:"required"`
	CustomerPhone string   `json:"customerPhone" binding:"required"`
}

func (h *ProjectHandler) BulkLockProducts(c *gin.Context) {
	var req BulkLockProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}

	err := h.productSvc.BulkLockProducts(c.Request.Context(), req.ProductIDs, req.BookedBy, req.CustomerName, req.CustomerPhone, 24)
	if err != nil {
		sendError(c, http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: map[string]interface{}{
		"message": "Products locked successfully",
		"count":   len(req.ProductIDs),
	}})
}

type UnlockProductRequest struct {
	RequestedBy string `json:"requestedBy" binding:"required"`
	IsAdmin     bool   `json:"isAdmin"`
}

func (h *ProjectHandler) UnlockProduct(c *gin.Context) {
	id := c.Param("id")
	var req UnlockProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}

	err := h.productSvc.UnlockProduct(c.Request.Context(), id, req.RequestedBy, req.IsAdmin)
	if err != nil {
		sendError(c, http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: map[string]string{"message": "Product unlocked successfully"}})
}

type BulkUnlockProductRequest struct {
	ProductIDs  []string `json:"productIds" binding:"required,min=1"`
	RequestedBy string   `json:"requestedBy" binding:"required"`
	IsAdmin     bool     `json:"isAdmin"`
}

func (h *ProjectHandler) BulkUnlockProducts(c *gin.Context) {
	var req BulkUnlockProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}

	err := h.productSvc.BulkUnlockProducts(c.Request.Context(), req.ProductIDs, req.RequestedBy, req.IsAdmin)
	if err != nil {
		sendError(c, http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: map[string]interface{}{
		"message": "Products unlocked successfully",
		"count":   len(req.ProductIDs),
	}})
}

type DepositProductRequest struct {
	RequestedBy string `json:"requestedBy" binding:"required"`
}

func (h *ProjectHandler) DepositProduct(c *gin.Context) {
	id := c.Param("id")
	var req DepositProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}

	err := h.productSvc.DepositProduct(c.Request.Context(), id, req.RequestedBy)
	if err != nil {
		sendError(c, http.StatusConflict, err.Error())
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: map[string]string{"message": "Product deposited successfully"}})
}

type SoldProductRequest struct {
	RequestedBy string `json:"requestedBy" binding:"required"`
}

func (h *ProjectHandler) SoldProduct(c *gin.Context) {
	id := c.Param("id")
	var req SoldProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}

	projectID, err := h.productSvc.SoldProduct(c.Request.Context(), id, req.RequestedBy)
	if err != nil {
		sendError(c, http.StatusConflict, err.Error())
		return
	}

	// Trigger sync project units using the returned projectID
	if projectID != "" {
		go h.projectSvc.SyncProjectUnits(context.Background(), projectID)
	}

	c.JSON(http.StatusOK, wrapper{Data: map[string]string{"message": "Product sold successfully"}})
}

func (h *ProjectHandler) DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	projectID, err := h.productSvc.DeleteProduct(c.Request.Context(), id)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	// Sync project units after deletion
	if projectID != "" {
		go h.projectSvc.SyncProjectUnits(context.Background(), projectID)
	}

	c.JSON(http.StatusOK, wrapper{Data: map[string]string{"message": "Product deleted successfully"}})
}

// ==================== DASHBOARD ENDPOINTS ====================

func (h *ProjectHandler) GetDashboardStats(c *gin.Context) {
	stats, err := h.projectSvc.GetDashboardStats(c.Request.Context())
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, wrapper{Data: stats})
}

func (h *ProjectHandler) GetStatusBreakdown(c *gin.Context) {
	projectID := c.Param("id")
	breakdown, err := h.productSvc.GetStatusBreakdown(c.Request.Context(), projectID)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, wrapper{Data: breakdown})
}

func (h *ProjectHandler) GetTotalStatusBreakdown(c *gin.Context) {
	breakdown, err := h.productSvc.GetTotalStatusBreakdown(c.Request.Context())
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusOK, wrapper{Data: breakdown})
}

// ==================== LEGAL DOCS ENDPOINTS ====================

func (h *ProjectHandler) ListDocs(c *gin.Context) {
	projectID := c.Param("id")
	docs, err := h.docSvc.ListDocs(c.Request.Context(), projectID)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: docs})
}

// In a real app we'd parse multipart form and save to S3. Here we simulate the metadata creation.
func (h *ProjectHandler) UploadDoc(c *gin.Context) {
	var req model.LegalDoc
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}
	req.ProjectID = c.Param("id")
	
	// Default uploader if available via middleware
	if userID, exists := c.Get("userID"); exists {
		req.UploadedBy = userID.(string)
	}

	created, err := h.docSvc.UploadDoc(c.Request.Context(), &req)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}

	c.JSON(http.StatusCreated, wrapper{Data: created})
}

type UpdateDocStatusRequest struct {
	Status string `json:"status" binding:"required"`
}

func (h *ProjectHandler) UpdateDocStatus(c *gin.Context) {
	docId := c.Param("docId")
	var req UpdateDocStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		sendError(c, http.StatusBadRequest, err.Error())
		return
	}

	err := h.docSvc.UpdateDocStatus(c.Request.Context(), docId, model.LegalDocStatus(req.Status))
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: map[string]string{"message": "Doc status updated"}})
}

func (h *ProjectHandler) DeleteDoc(c *gin.Context) {
	docID := c.Param("docId")

	err := h.docSvc.DeleteDoc(c.Request.Context(), docID)
	if err != nil {
		sendError(c, http.StatusInternalServerError, err.Error())
		return
	}
	c.JSON(http.StatusOK, wrapper{Data: map[string]string{"message": "Document deleted successfully"}})
}
