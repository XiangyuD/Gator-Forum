package dao

import (
	"GFBackend/entity"
	"GFBackend/model"
	"gorm.io/gorm"
	"sync"
)

var userDAOLock sync.Mutex
var userDAO *UserDAO

type IUserDAO interface {
	CreateUser(user entity.User) error
	GetUserByUsername(username string) entity.User
	DeleteUserByUsername(username string) error
	UpdateUserPassword(username string, newPassword string) error
	UpdateUserByUsername(userInfo entity.User) error
	GetUserInfoByUsername(username string) (entity.User, error)
	GetUsersByUsernameFuzzySearch(username string, offset, limit int) ([]entity.User, error)
}

type UserDAO struct {
	db *gorm.DB
}

func NewUserDAO() *UserDAO {
	if userDAO == nil {
		userDAOLock.Lock()
		if userDAO == nil {
			userDAO = &UserDAO{
				db: model.NewDB(),
			}
		}
		userDAOLock.Unlock()
	}
	return userDAO
}

func (userDAO *UserDAO) CreateUser(user entity.User) error {
	// strings in Select() must be as same as User field variables name
	var result *gorm.DB
	result = userDAO.db.Select("Username", "Password", "Salt").Create(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (userDAO *UserDAO) GetUserByUsername(username string) entity.User {
	var user entity.User
	userDAO.db.Where("username = ?", username).First(&user)
	return user
}

func (userDAO *UserDAO) DeleteUserByUsername(username string) error {
	var result *gorm.DB
	result = userDAO.db.Where("Username = ?", username).Delete(&entity.User{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (userDAO *UserDAO) UpdateUserPassword(username string, newPassword string) error {
	result := userDAO.db.Model(&entity.User{}).Where("Username = ?", username).Update("password", newPassword)
	if result.Error != nil {
		return result.Error
	} else {
		return nil
	}
}

func (userDAO *UserDAO) UpdateUserByUsername(userInfo entity.User) error {
	result := userDAO.db.Model(&entity.User{}).Where("Username = ?", userInfo.Username).Updates(entity.User{
		Nickname:   userInfo.Nickname,
		Birthday:   userInfo.Birthday,
		Gender:     userInfo.Gender,
		Department: userInfo.Department,
	})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (userDAO *UserDAO) GetUserInfoByUsername(username string) (entity.User, error) {
	var userInfo entity.User
	result := userDAO.db.Where("Username = ?", username).Find(&userInfo)
	if result.Error != nil {
		return entity.User{}, result.Error
	}
	return userInfo, nil
}

func (userDAO *UserDAO) GetUsersByUsernameFuzzySearch(username string, offset, limit int) ([]entity.User, error) {
	var users []entity.User
	result := userDAO.db.Where("username like ?", "%"+username+"%").Offset(offset).Limit(limit).Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}
