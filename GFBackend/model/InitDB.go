package model

import (
	"GFBackend/config"
	"GFBackend/entity"
	"GFBackend/utils"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"gorm.io/gorm/logger"
	"sync"
)

var db *gorm.DB
var dbLock sync.Mutex

func NewDB() *gorm.DB {
	if db == nil {
		dbLock.Lock()
		if db == nil {
			db = createDB()
			dataInit()
		}
		dbLock.Unlock()
	}
	return db
}

func createDB() *gorm.DB {
	appConfig := config.AppConfig
	dsn := appConfig.Database.Username + ":" +
		appConfig.Database.Password + "@tcp(" +
		appConfig.Database.IP + ")/" +
		appConfig.Database.DB1 + "?charset=utf8&parseTime=True&loc=Local"
	newDB, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic("failed to connect database")
	}
	return newDB
}

func dataInit() {
	// default admin user
	salt := utils.GetRandomString(6)
	defaultAdmin := entity.User{
		Username: "boss",
		Password: utils.EncodeInMD5("007" + salt),
		Salt:     salt,
	}
	db.Clauses(clause.OnConflict{DoNothing: true}).Select("Username", "Password", "Salt").Create(&defaultAdmin)
}
