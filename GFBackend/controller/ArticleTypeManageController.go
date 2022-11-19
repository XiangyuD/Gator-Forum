package controller

import (
	"GFBackend/entity"
	"GFBackend/middleware/auth"
	"GFBackend/service"
	"github.com/gin-gonic/gin"
	"github.com/google/wire"
	"net/http"
	"sync"
)

var articleTypeManageControllerLock sync.Mutex
var articleTypeManageController *ArticleTypeManageController

type ArticleTypeManageController struct {
	articleTypeManageService service.IArticleTypeManageService
}

func NewArticleTypeManageController(articleTypeManageService service.IArticleTypeManageService) *ArticleTypeManageController {
	if articleTypeManageController == nil {
		articleTypeManageControllerLock.Lock()
		if articleTypeManageController == nil {
			articleTypeManageController = &ArticleTypeManageController{
				articleTypeManageService: articleTypeManageService,
			}
		}
		articleTypeManageControllerLock.Unlock()
	}
	return articleTypeManageController
}

var ArticleTypeManageControllerSet = wire.NewSet(
	service.ArticleTypeManageServiceSet,
	wire.Bind(new(service.IArticleTypeManageService), new(*service.ArticleTypeManageService)),
	NewArticleTypeManageController,
)

// CreateArticleType godoc
// @Summary Create a new article type by admin user
// @Description need token in cookie, need new article type information, cannot repeat type name
// @Tags Article Type Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param ArticleTypeInfo body entity.ArticleTypeInfo true "New Article Type Information"
// @Success 200 {object} entity.ResponseMsg "<b>Success</b>. Create Successfully"
// @Failure 400 {object} entity.ResponseMsg "<b>Failure</b>. Bad Parameters / Type has existed"
// @Failure 500 {object} entity.ResponseMsg "<b>Failure</b>. Server Internal Error."
// @Router /articletype/create [post]
func (articleTypeManageController *ArticleTypeManageController) CreateArticleType(context *gin.Context) {
	errMsg := entity.ResponseMsg{
		Code:    400,
		Message: "Bad Parameters",
	}
	var articleTypeInfo entity.ArticleTypeInfo
	if err1 := context.ShouldBind(&articleTypeInfo); err1 != nil {
		context.JSON(400, errMsg)
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	if err2 := articleTypeManageController.articleTypeManageService.CreateArticleType(username, articleTypeInfo.TypeName, articleTypeInfo.Description); err2 != nil {
		if err2.Error() == "400" {
			errMsg.Message = "Duplicate Type Name"
		} else {
			errMsg.Code = 500
			errMsg.Message = "Internal Server Error"
		}
		context.JSON(errMsg.Code, errMsg)
	}

	errMsg.Code = 200
	errMsg.Message = "Create Successfully"
	context.JSON(200, errMsg)
}

// GetArticleTypes godoc
// @Summary Get All Article Types
// @Description
// @Tags Article Type Manage
// @Accept json
// @Produce json
// @Success 200 {object} []entity.ArticleType "<b>Success</b>. Get Successfully"
// @Failure 400 {object} entity.ResponseMsg "<b>Failure</b>. Bad Parameters / Type has existed"
// @Failure 500 {object} entity.ResponseMsg "<b>Failure</b>. Server Internal Error."
// @Router /articletype/all [get]
func (articleTypeManageController *ArticleTypeManageController) GetArticleTypes(context *gin.Context) {
	articleTypes, err1 := articleTypeManageController.articleTypeManageService.GetArticleTypes()
	errMsg := entity.ResponseMsg{
		Code:    500,
		Message: "Internal Server Error",
	}
	if err1 != nil {
		context.JSON(500, errMsg)
		return
	}
	context.JSON(200, articleTypes)
}

// RemoveArticleType godoc
// @Summary Admin user removes article type
// @Description need token in cookie, need type name
// @Tags Article Type Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param TypeName body string true "Type Name"
// @Success 200 {object} entity.ResponseMsg "<b>Success</b>. Remove Successfully"
// @Failure 400 {object} entity.ResponseMsg "<b>Failure</b>. Bad Parameters"
// @Failure 500 {object} entity.ResponseMsg "<b>Failure</b>. Server Internal Error."
// @Router /articletype/remove [post]
func (articleTypeManageController *ArticleTypeManageController) RemoveArticleType(context *gin.Context) {
	type Info struct {
		TypeName string `json:"TypeName"`
	}
	var info Info
	respMsg := entity.ResponseMsg{
		Code:    http.StatusBadRequest,
		Message: "Bad Parameters.",
	}
	if err1 := context.ShouldBind(&info); err1 != nil {
		context.JSON(http.StatusBadRequest, respMsg)
		return
	}

	err2 := articleTypeManageController.articleTypeManageService.RemoveArticleType(info.TypeName)
	if err2 != nil {
		respMsg.Code = 500
		respMsg.Message = "Internal Server Error"
		context.JSON(respMsg.Code, respMsg.Message)
		return
	}
	respMsg.Code = 200
	respMsg.Message = "Remove Successfully"
	context.JSON(200, respMsg)
	return
}

// UpdateArticleTypeDescription godoc
// @Summary Admin user update article type description
// @Description need token in cookie, need type name & new description
// @Tags Article Type Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param TypeName body string true "Type Name"
// @Param Description body string true "Description"
// @Success 200 {object} entity.ResponseMsg "<b>Success</b>. Update Successfully"
// @Failure 400 {object} entity.ResponseMsg "<b>Failure</b>. Bad Parameters"
// @Failure 500 {object} entity.ResponseMsg "<b>Failure</b>. Server Internal Error."
// @Router /articletype/update [post]
func (articleTypeManageController *ArticleTypeManageController) UpdateArticleTypeDescription(context *gin.Context) {
	type Info struct {
		TypeName    string `json:"TypeName"`
		Description string `json:"Description"`
	}
	var info Info
	respMsg := entity.ResponseMsg{
		Code:    http.StatusBadRequest,
		Message: "Bad Parameters.",
	}
	if err1 := context.ShouldBind(&info); err1 != nil {
		context.JSON(http.StatusBadRequest, respMsg)
		return
	}

	err2 := articleTypeManageController.articleTypeManageService.UpdateArticleTypeDescription(info.TypeName, info.Description)
	if err2 != nil {
		respMsg.Code = 500
		respMsg.Message = "Internal Server Error"
		context.JSON(respMsg.Code, respMsg.Message)
		return
	}
	respMsg.Code = 200
	respMsg.Message = "Update Successfully"
	context.JSON(200, respMsg)
	return
}
