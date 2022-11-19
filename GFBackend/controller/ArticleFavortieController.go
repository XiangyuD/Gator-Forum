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

var articleFavoriteControllerLock sync.Mutex
var articleFavoriteController *ArticleFavoriteController

type ArticleFavoriteController struct {
	articleFavoriteService service.IArticleFavoriteService
}

func NewArticleFavoriteController(articleFavoriteService service.IArticleFavoriteService) *ArticleFavoriteController {
	if articleFavoriteController == nil {
		articleFavoriteControllerLock.Lock()
		if articleFavoriteController == nil {
			articleFavoriteController = &ArticleFavoriteController{
				articleFavoriteService: articleFavoriteService,
			}
		}
		articleFavoriteControllerLock.Unlock()
	}
	return articleFavoriteController
}

var ArticleFavoriteControllerSet = wire.NewSet(
	service.ArticleFavoriteServiceSet,
	wire.Bind(new(service.IArticleFavoriteService), new(*service.ArticleFavoriteService)),
	NewArticleFavoriteController,
)

// CreateFavorite godoc
// @Summary User Favorite Article
// @Description need token in cookie, need article id
// @Tags Article Favorite Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param ArticleID query integer true "233333"
// @Success 200 {string} string "<b>Success</b>. Create Successfully"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters or Not Found or Existed"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /articlefavorite/create/:articleID [post]
func (articleFavoriteController ArticleFavoriteController) CreateFavorite(context *gin.Context) {
	id, err1 := strconv.Atoi(context.Param("articleID"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	err2 := articleFavoriteController.articleFavoriteService.CreateFavorite(username, id)
	if err2 != nil {
		if strings.Contains(err2.Error(), "400") {
			context.JSON(400, "Bad Parameters or Not Found or Existed")
		} else {
			context.JSON(500, "Server Internal Error.")
		}
		return
	}

	context.JSON(200, "200")
}

// DeleteFavorite godoc
// @Summary User cancel favorite Article
// @Description need token in cookie, need article id
// @Tags Article Favorite Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param ArticleID query integer true "233333"
// @Success 200 {string} string "<b>Success</b>. Delete Favorite Successfully"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters"
// @Router /articlefavorite/delete/:articleID [post]
func (articleFavoriteController ArticleFavoriteController) DeleteFavorite(context *gin.Context) {
	id, err1 := strconv.Atoi(context.Param("articleID"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	_ = articleFavoriteController.articleFavoriteService.DeleteFavorite(username, id)

	context.JSON(200, "200")
}

// GetUserFavorites godoc
// @Summary User like Article
// @Description need token in cookie
// @Tags Article Favorite Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param pageno query integer true "233333, /articlelike/get?pageno=&pagesize="
// @Param pagesize query integer true "233333, /articlelike/get?pageno=&pagesize="
// @Success 200 {object} entity.ArticleFavoritesInfo "<b>Success</b>. Create Successfully"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters or Not Found"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /articlefavorite/get [get]
func (articleFavoriteController ArticleFavoriteController) GetUserFavorites(context *gin.Context) {
	pageNO, err1 := strconv.Atoi(context.Query("pageno"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	pageSize, err2 := strconv.Atoi(context.Query("pagesize"))
	if err2 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	articleFavoritesInfo, articleDetails, err3 := articleFavoriteController.articleFavoriteService.GetUserFavorites(username, pageNO, pageSize)
	if err3 != nil {
		if strings.Contains(err3.Error(), "400") {
			context.JSON(400, "Bad Parameters")
		} else {
			context.JSON(500, "Server Internal Error.")
		}
		return
	}

	context.JSON(200, gin.H{
		"articleFavoritesInfo": articleFavoritesInfo,
		"articleDetails":       articleDetails,
	})
}

// GetFavoriteOfArticle godoc
// @Summary User Favorite Article
// @Description need token in cookie, need article id
// @Tags Article Favorite Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param ArticleID query integer true "233333"
// @Success 200 {string} string "<b>Success</b>. Create Successfully"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters or Not Found or Existed"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /articlefavorite/getfavoriteofarticle [get]
func (articleFavoriteController ArticleFavoriteController) GetFavoriteOfArticle(context *gin.Context) {
	articleID, err1 := strconv.Atoi(context.Query("articleID"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}
	articleFavoriteList, err2 := articleFavoriteController.articleFavoriteService.GetFavoriteOfArticle(articleID)
	if err2 != nil {
		context.JSON(500, "Server Internal Error.")
		return
	}
	context.JSON(200, articleFavoriteList)
}
