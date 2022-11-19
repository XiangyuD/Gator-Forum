package main

import (
	"GFBackend/cache"
	"GFBackend/config"
	"GFBackend/elasticsearch"
	"GFBackend/logger"
	"GFBackend/middleware/auth"
	"GFBackend/model"
	"GFBackend/router"
)

// @title Gator Forum Backend API
// @version 1.0
// @description This is the Gator Forum Backend Server
// @termsOfService https://github.com/fongziyjun16/SE/tree/backend

// @securityDefinitions.apikey ApiAuthToken
// @in cookies
// @name token

// @host http://167.71.166.120:10010
// @BasePath /gf/api
func main() {
	// Components Initialization
	config.InitConfig()
	logger.InitAppLogger()
	defer logger.AppLogger.Sync()
	model.NewDB()
	cache.InitRedis()
	auth.InitCasbin()
	elasticsearch.InitES()
	defer elasticsearch.ESClient.Stop()
	router.RunServer()
}
