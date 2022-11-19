package reqs

import "github.com/gin-gonic/gin"

func InitArticleLikeReqs(baseGroup *gin.RouterGroup) *gin.RouterGroup {

	articleLikeController, _ := InitializeArticleLikeController()

	articleLikeReqsGroup := baseGroup.Group("/articlelike")
	{
		articleLikeReqsGroup.POST("/create/:articleID", articleLikeController.CreateLike)
		articleLikeReqsGroup.POST("/delete/:articleID", articleLikeController.DeleteLike)
		articleLikeReqsGroup.GET("/getlikelist", articleLikeController.GetLikeList)
	}

	return articleLikeReqsGroup

}
