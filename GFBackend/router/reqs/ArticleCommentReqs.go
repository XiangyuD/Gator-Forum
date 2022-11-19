package reqs

import "github.com/gin-gonic/gin"

func InitArticleCommentReqs(baseGroup *gin.RouterGroup) *gin.RouterGroup {

	articleCommentController, _ := InitializeArticleCommentController()

	articleCommentReqsGroup := baseGroup.Group("/articlecomment")
	{
		articleCommentReqsGroup.POST("/create", articleCommentController.CreateComment)
		articleCommentReqsGroup.POST("/delete/:id", articleCommentController.DeleteCommentByID)
		articleCommentReqsGroup.GET("/getbyarticleid", articleCommentController.GetCommentsByArticleID)
		articleCommentReqsGroup.GET("/getsub", articleCommentController.GetSubCommentsByArticleIDAndCommentID)
	}

	return articleCommentReqsGroup
}
