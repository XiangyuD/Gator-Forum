package router

import (
	"GFBackend/config"
	"GFBackend/docs"
	"GFBackend/logger"
	"GFBackend/middleware/interceptor"
	"GFBackend/router/reqs"
	"fmt"
	"github.com/gin-gonic/gin"
	swaggerfiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"strconv"
)

var AppRouter *gin.Engine

func RunServer() {
	appConfig := config.AppConfig

	interceptor.InitNonAuthReq()
	AppRouter = gin.Default()
	AppRouter.Static("/resources", "./resources")
	AppRouter.Use(interceptor.AuthInterceptor())

	docs.SwaggerInfo.BasePath = appConfig.Server.BasePath
	AppRouter.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerfiles.Handler))

	baseGroup := AppRouter.Group(appConfig.Server.BasePath)
	{
		reqs.InitUserManageReqs(baseGroup)
		reqs.InitCommunityManageReqs(baseGroup)
		reqs.InitFileManageReqs(baseGroup)
		reqs.InitArticleTypeManageReqs(baseGroup)
		reqs.InitArticleManageReqs(baseGroup)
		reqs.InitArticleLikeReqs(baseGroup)
		reqs.InitArticleFavoriteReqs(baseGroup)
		reqs.InitArticleCommentReqs(baseGroup)
	}

	err := AppRouter.Run(":" + strconv.Itoa(appConfig.Server.Port))
	if err != nil {
		logger.AppLogger.Error(fmt.Sprintf("Start Server Error: %s", err.Error()))
		panic("server error")
	}
}
