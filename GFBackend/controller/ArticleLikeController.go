package controller

import (
	"GFBackend/middleware/auth"
	"GFBackend/service"
	"github.com/gin-gonic/gin"
	"github.com/google/wire"
	"strconv"
	"strings"
	"sync"
)

var articleLikeControllerLock sync.Mutex
var articleLikeController *ArticleLikeController

type ArticleLikeController struct {
	articleLikeService service.IArticleLikeService
}

func NewArticleLikeController(articleLikeService service.IArticleLikeService) *ArticleLikeController {
	if articleLikeController == nil {
		articleLikeControllerLock.Lock()
		if articleLikeController == nil {
			articleLikeController = &ArticleLikeController{
				articleLikeService: articleLikeService,
			}
		}
		articleLikeControllerLock.Unlock()
	}
	return articleLikeController
}

var ArticleLikeControllerSet = wire.NewSet(
	service.ArticleLikeServiceSet,
	wire.Bind(new(service.IArticleLikeService), new(*service.ArticleLikeService)),
	NewArticleLikeController,
)

// CreateLike godoc
// @Summary User like Article
// @Description need token in cookie, need article id
// @Tags Article Like Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param ArticleID query integer true "233333"
// @Success 200 {string} string "<b>Success</b>. Create Successfully"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters or Not Found"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /articlelike/create/:articleID [post]
func (articleLikeController ArticleLikeController) CreateLike(context *gin.Context) {
	id, err1 := strconv.Atoi(context.Param("articleID"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	err2 := articleLikeController.articleLikeService.CreateLike(username, id)
	if err2 != nil {
		if strings.Contains(err2.Error(), "400") {
			context.JSON(400, "Bad Parameters or Not Found")
		} else {
			context.JSON(500, "Server Internal Error.")
		}
		return
	}
	context.JSON(200, "200")
}

// DeleteLike godoc
// @Summary User cancel like Article
// @Description need token in cookie, need article id
// @Tags Article Like Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param ArticleID query integer true "233333"
// @Success 200 {string} string "<b>Success</b>. Delete Like Successfully"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters"
// @Router /articlelike/delete/:articleID [post]
func (articleLikeController ArticleLikeController) DeleteLike(context *gin.Context) {
	id, err1 := strconv.Atoi(context.Param("articleID"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	_ = articleLikeController.articleLikeService.DeleteLike(username, id)

	context.JSON(200, "200")
}

// GetLikeList godoc
// @Summary Get User's Like List
// @Description need token in cookie
// @Param articleID query integer true "233333"
// @Tags Article Like Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Success 200 {string} string "<b>Success</b>. Get Like List Successfully"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters"
// @Router /articlelike/getlikelist [get]
func (articleLikeController *ArticleLikeController) GetLikeList(context *gin.Context) {
	articleID, err1 := strconv.Atoi(context.Query("articleID"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}
	articleLikeList, err2 := articleLikeController.articleLikeService.GetLikeList(articleID)
	if err2 != nil {
		context.JSON(500, "Server Internal Error.")
		return
	}
	context.JSON(200, articleLikeList)
}
