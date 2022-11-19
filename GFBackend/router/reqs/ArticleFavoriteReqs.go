package reqs

import "github.com/gin-gonic/gin"

func InitArticleFavoriteReqs(baseGroup *gin.RouterGroup) *gin.RouterGroup {

	articleFavoriteController, _ := InitializeArticleFavoriteController()

	articleFavoriteReqsGroup := baseGroup.Group("/articlefavorite")
	{
		articleFavoriteReqsGroup.POST("/create/:articleID", articleFavoriteController.CreateFavorite)
		articleFavoriteReqsGroup.POST("/delete/:articleID", articleFavoriteController.DeleteFavorite)
		articleFavoriteReqsGroup.GET("/get", articleFavoriteController.GetUserFavorites)
		articleFavoriteReqsGroup.GET("/getfavoriteofarticle", articleFavoriteController.GetFavoriteOfArticle)
	}

	return articleFavoriteReqsGroup
}
