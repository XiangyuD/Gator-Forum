package reqs

import "github.com/gin-gonic/gin"

func InitArticleManageReqs(baseGroup *gin.RouterGroup) *gin.RouterGroup {

	articleManageController, _ := InitializeArticleManageController()

	articleTypeManageReqsGroup := baseGroup.Group("/article")
	{
		articleTypeManageReqsGroup.POST("/create", articleManageController.CreateArticle)
		articleTypeManageReqsGroup.GET("/delete/:id", articleManageController.DeleteArticle)
		articleTypeManageReqsGroup.POST("/update", articleManageController.UpdateArticleTitleOrContentByID)
		articleTypeManageReqsGroup.GET("/getone", articleManageController.GetOneArticleByID)
		articleTypeManageReqsGroup.POST("/search", articleManageController.GetArticlesBySearchWords)
		articleTypeManageReqsGroup.GET("/getarticlelist", articleManageController.GetArticleList)
		articleTypeManageReqsGroup.GET("/getarticlelistbycommunityid", articleManageController.GetArticleListByCommunityID)
	}

	return articleTypeManageReqsGroup
}
