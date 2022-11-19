package controller

import (
	"GFBackend/entity"
	"GFBackend/middleware/auth"
	"GFBackend/service"
	"github.com/gin-gonic/gin"
	"github.com/google/wire"
	"strconv"
	"strings"
	"sync"
)

var articleCommentControllerLock sync.Mutex
var articleCommentController *ArticleCommentController

type ArticleCommentController struct {
	articleCommentService service.IArticleCommentService
}

func NewArticleCommentController(articleCommentService service.IArticleCommentService) *ArticleCommentController {
	if articleCommentController == nil {
		articleCommentControllerLock.Lock()
		if articleCommentController == nil {
			articleCommentController = &ArticleCommentController{
				articleCommentService: articleCommentService,
			}
		}
		articleCommentControllerLock.Unlock()
	}
	return articleCommentController
}

var ArticleCommentControllerSet = wire.NewSet(
	service.ArticleCommentServiceSet,
	wire.Bind(new(service.IArticleCommentService), new(*service.ArticleCommentService)),
	NewArticleCommentController,
)

// CreateComment godoc
// @Summary Create a new comment to article or comment
// @Description need token in cookie, need new article comment info, if comment to article, no need CommentID
// @Tags Article Comment Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param ArticleInfo body entity.NewCommentInfo true "Create New Comment"
// @Success 200 {string} string "<b>Success</b>. Create Successfully"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters / Info Error"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /articlecomment/create [post]
func (articleCommentController *ArticleCommentController) CreateComment(context *gin.Context) {
	var newCommentInfo entity.NewCommentInfo
	err1 := context.ShouldBindJSON(&newCommentInfo)
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	err2 := articleCommentController.articleCommentService.CreateComment(username, newCommentInfo.ArticleID, newCommentInfo.CommentID, newCommentInfo.Content)
	if err2 != nil {
		if strings.Contains(err2.Error(), "400") {
			context.JSON(400, "Info Error")
		} else {
			context.JSON(500, "Server Internal Error")
		}
		return
	}

	context.JSON(200, "Create Successfully")
}

// DeleteCommentByID godoc
// @Summary Delete a comment by id
// @Description need token in cookie, need comment ID
// @Tags Article Comment Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param id query string true "Comment ID"
// @Success 200 {string} string "<b>Success</b>. Delete Successfully"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters / Info Error"
// @Router /articlecomment/delete/:id [post]
func (articleCommentController *ArticleCommentController) DeleteCommentByID(context *gin.Context) {
	id, err1 := strconv.Atoi(context.Param("id"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	_ = articleCommentController.articleCommentService.DeleteCommentByID(id, username)

	context.JSON(200, "Delete Successfully")
}

// GetCommentsByArticleID godoc
// @Summary get direct comments by article id
// @Description need token in cookie, need article id, pageno, pagesize in url: "/articlecomment/getbyarticleid?id=&pageno=&pagesize="
// @Tags Article Comment Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param articleid query string true "Article ID"
// @Param pageno query string true "PageNO"
// @Param pagesize query string true "PageSize"
// @Success 200 {object} entity.ArticleCommentsInfo "<b>Success</b>. Search Successfully"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters / Info Error"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /articlecomment/getbyarticleid [get]
func (articleCommentController *ArticleCommentController) GetCommentsByArticleID(context *gin.Context) {
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

	articleID, err3 := strconv.Atoi(context.Query("id"))
	if err3 != nil {
		context.JSON(400, "Bad Parameters")
		return

	}

	articleCommentsInfo, err4 := articleCommentController.articleCommentService.GetCommentsByArticleID(articleID, pageNO, pageSize)
	if err4 != nil {
		context.JSON(500, "Server Internal Error.")
		return
	}

	context.JSON(200, articleCommentsInfo)
}

// GetSubCommentsByArticleIDAndCommentID godoc
// @Summary get sub comments by article id and comment id
// @Description need token in cookie, need article id, comment id, pageno, pagesize in url: "/articlecomment/getbyarticleid?articleid=&commentid=&pageno=&pagesize="
// @Tags Article Comment Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param articleid query string true "Article ID"
// @Param commentid query string true "Comment ID"
// @Param pageno query string true "PageNO"
// @Param pagesize query string true "PageSize"
// @Success 200 {object} entity.ArticleCommentsInfo "<b>Success</b>. Search Successfully"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters / Info Error"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /articlecomment/getsub [get]
func (articleCommentController *ArticleCommentController) GetSubCommentsByArticleIDAndCommentID(context *gin.Context) {
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

	articleID, err3 := strconv.Atoi(context.Query("articleid"))
	if err3 != nil {
		context.JSON(400, "Bad Parameters")
		return

	}

	commentID, err4 := strconv.Atoi(context.Query("commentid"))
	if err4 != nil {
		context.JSON(400, "Bad Parameters")
		return

	}

	articleCommentsInfo, err5 := articleCommentController.articleCommentService.GetSubCommentsByArticleIDAndCommentID(articleID, commentID, pageNO, pageSize)
	if err5 != nil {
		context.JSON(500, "Server Internal Error.")
		return
	}

	context.JSON(200, articleCommentsInfo)
}
