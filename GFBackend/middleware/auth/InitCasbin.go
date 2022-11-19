package auth

import (
	"GFBackend/config"
	"GFBackend/logger"
	"GFBackend/model"
	"github.com/casbin/casbin/v2"
	gormadapter "github.com/casbin/gorm-adapter/v3"
)

var CasbinEnforcer *casbin.Enforcer

func InitCasbin() {
	a, _ := gormadapter.NewAdapterByDB(model.NewDB())
	e, err := casbin.NewEnforcer("middleware/auth/rbac_model.conf", a)
	CasbinEnforcer = e
	if err != nil {
		logger.AppLogger.Error(err.Error())
		panic(err)
	}
	err = CasbinEnforcer.LoadPolicy()
	if err != nil {
		logger.AppLogger.Error(err.Error())
		panic(err)
	}

	addInitialPolicy()
}

func addInitialPolicy() {
	basePath := config.AppConfig.Server.BasePath

	// regular

	// /user/...
	CasbinEnforcer.AddPolicy("regular", basePath+"/user/logout", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/user/password", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/user/update", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/user/follow", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/user/unfollow", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/user/followers", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/user/followees", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/user/getuserinfo", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/user/getusersinfo", "GET")

	// /community/...
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/create", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/delete", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/update", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/numberofmember", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/getone", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/getbyname", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/get", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/join", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/leave/:id", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/getmember", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/getcommunityidbymember", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/community/getcommunitiesbycreator", "GET")

	// /file/...
	CasbinEnforcer.AddPolicy("regular", basePath+"/file/upload", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/file/upload/communityavatar/:groupid", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/file/download", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/file/delete", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/file/scan", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/file/space/info", "POST")

	// /article/..
	CasbinEnforcer.AddPolicy("regular", basePath+"/article/create", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/article/delete/:id", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/article/update", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/article/getone", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/article/getarticlelist", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/article/getarticlelistbycommunityid", "GET")

	// /articlelike/..
	CasbinEnforcer.AddPolicy("regular", basePath+"/articlelike/create/:articleID", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/articlelike/delete/:articleID", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/articlelike/getlikelist", "GET")

	// /articlefavorite/..
	CasbinEnforcer.AddPolicy("regular", basePath+"/articlefavorite/create/:articleID", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/articlefavorite/delete/:articleID", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/articlefavorite/get", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/articlefavorite/getfavoriteofarticle", "GET")

	// /articlecomment/..
	CasbinEnforcer.AddPolicy("regular", basePath+"/articlecomment/create", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/articlecomment/delete/:id", "POST")
	CasbinEnforcer.AddPolicy("regular", basePath+"/articlecomment/getbyarticleid", "GET")
	CasbinEnforcer.AddPolicy("regular", basePath+"/articlecomment/getsub", "GET")

	// admin
	CasbinEnforcer.AddGroupingPolicy("admin", "regular") // admin extends regular
	CasbinEnforcer.AddPolicy("admin", basePath+"/user/admin/register", "POST")
	CasbinEnforcer.AddPolicy("admin", basePath+"/user/admin/delete", "POST")
	CasbinEnforcer.AddPolicy("admin", basePath+"/file/space/update", "POST")
	CasbinEnforcer.AddPolicy("admin", basePath+"/articletype/create", "POST")
	CasbinEnforcer.AddPolicy("admin", basePath+"/articletype/remove", "POST")
	CasbinEnforcer.AddPolicy("admin", basePath+"/articletype/update", "POST")

	// default admin user
	CasbinEnforcer.AddGroupingPolicy("boss", "admin")
}
