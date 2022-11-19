package interceptor

import (
	"GFBackend/cache"
	"GFBackend/config"
	"GFBackend/entity"
	"GFBackend/logger"
	"GFBackend/middleware/auth"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

var (
	NonAuthReqs map[string]bool
)

func InitNonAuthReq() {
	nonAuthReqs := [...]string{
		"/user/register",
		"/user/login",
		"/user/logout",
		"/articletype/all",
		"/article/search",
	}
	NonAuthReqs = make(map[string]bool)
	for _, endpoint := range nonAuthReqs {
		NonAuthReqs[config.AppConfig.Server.BasePath+endpoint] = true
	}
}

func AuthInterceptor() gin.HandlerFunc {
	return func(context *gin.Context) {
		req := context.FullPath()
		if NonAuthReqs[req] || strings.Contains(req, "swagger") {
			context.Next()
		} else {
			token, err1 := context.Cookie("token")
			username, err2 := auth.GetTokenUsername(token)
			if err1 != nil || !auth.TokenVerify(token) || err2 != nil {
				setAuthFailure(context, http.StatusBadRequest, "Authentication Failure. ReLogin Again.")
				return
			}

			sign, err3 := cache.GetLoginUserSign(username)
			if err3 != nil || sign == "" {
				setAuthFailure(context, http.StatusBadRequest, "Authentication Failure. ReLogin Again.")
				return
			}

			rolePass, err4 := auth.CasbinEnforcer.Enforce(username, req, context.Request.Method)
			if err4 != nil {
				logger.AppLogger.Error(err4.Error())
				setAuthFailure(context, http.StatusInternalServerError, "Internal Server Error")
				return
			} else {
				if rolePass {
					context.Next()
				} else {
					setAuthFailure(context, http.StatusBadRequest, "No Authorization")
					return
				}
			}

			newTokenInfo, err5, newTokenFlag := auth.TokenRefresh(token)
			if err5 != nil {
				logger.AppLogger.Error(err5.Error())
				setAuthFailure(context, http.StatusInternalServerError, "Internal Server Error")
				return
			}
			if newTokenFlag {
				context.SetCookie("token", newTokenInfo.Token, config.AppConfig.JWT.Expires*60, config.AppConfig.Server.BasePath, "localhost", false, true)
				newSign, _ := auth.GetTokenSign(newTokenInfo.Token)
				err6 := cache.UpdLoginUserSign(username, newSign)
				if err6 != nil {
					logger.AppLogger.Error(err6.Error())
					setAuthFailure(context, http.StatusInternalServerError, "Internal Server Error")
					return
				}
			}
		}
	}
}

func setAuthFailure(context *gin.Context, code int, message string) {
	context.Abort()
	errMsg := entity.ResponseMsg{
		Code:    code,
		Message: message,
	}
	context.JSON(code, errMsg)
}
