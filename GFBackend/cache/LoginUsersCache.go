package cache

import (
	"GFBackend/config"
	"time"
)

func AddLoginUserWithSign(username, sign string) error {
	err := RDB.Set(ctx, username, sign, time.Duration(config.AppConfig.JWT.Expires)*time.Minute).Err()
	if err != nil {
		return err
	}
	return nil
}

func GetLoginUserSign(username string) (string, error) {
	sign, err := RDB.Get(ctx, username).Result()
	if err != nil {
		return "", err
	}
	return sign, nil
}

func DelLoginUserSign(username string) error {
	_, err1 := RDB.Del(ctx, username).Result()
	if err1 != nil {
		return err1
	}
	return nil
}

func UpdLoginUserSign(username, sign string) error {
	err1 := DelLoginUserSign(username)
	if err1 != nil {
		return err1
	}

	err2 := AddLoginUserWithSign(username, sign)
	if err2 != nil {
		return err2
	}

	return nil
}
