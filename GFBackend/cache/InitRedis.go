package cache

import (
	"GFBackend/config"
	"GFBackend/logger"
	"context"
	"github.com/go-redis/redis/v8"
	"strconv"
)

var RDB *redis.Client
var ctx context.Context

func InitRedis() {
	appConfig := config.AppConfig

	RDB = redis.NewClient(&redis.Options{
		Addr:     appConfig.Redis.IP + ":" + strconv.Itoa(appConfig.Redis.Port),
		Password: appConfig.Redis.Password,
		DB:       appConfig.Redis.DB,
	})

	ctx = context.Background()

	result, err := RDB.Ping(ctx).Result()
	if err != nil {
		logger.AppLogger.Error(err.Error())
		return
	}
	logger.AppLogger.Info("redis ping: " + result)

	RDB.FlushAll(ctx)
}
