package dao

import (
	"GFBackend/entity"
	"GFBackend/model"
	"gorm.io/gorm"
	"sync"
	"time"
)

var followDAOLock sync.Mutex
var followDAO *FollowDAO

type IFollowDAO interface {
	GetOneFollow(followee, follower string) (entity.Follow, error)
	GetFollowers(username string) ([]entity.Follow, error)
	GetFollowees(username string) ([]entity.Follow, error)
	UserFollow(followee, follower string) error
	UserUnfollow(followee, follower string) error
	DeleteFollow(username string) error
}

type FollowDAO struct {
	db *gorm.DB
}

func NewFollowDAO() *FollowDAO {
	if followDAO == nil {
		followDAOLock.Lock()
		if followDAO == nil {
			followDAO = &FollowDAO{
				db: model.NewDB(),
			}
		}
		followDAOLock.Unlock()
	}
	return followDAO
}

func (followDAO *FollowDAO) GetOneFollow(followee, follower string) (entity.Follow, error) {
	follow := entity.Follow{}
	result := followDAO.db.Where("Followee = ? AND Follower = ?", followee, follower).First(&follow)
	if result.Error != nil {
		return follow, result.Error
	}
	return follow, nil
}

func (followDAO *FollowDAO) GetFollowers(username string) ([]entity.Follow, error) {
	var follows []entity.Follow
	result := followDAO.db.Where("followee = ?", username).Find(&follows)
	if result.Error != nil {
		return nil, result.Error
	}
	return follows, nil
}

func (followDAO *FollowDAO) GetFollowees(username string) ([]entity.Follow, error) {
	var follows []entity.Follow
	result := followDAO.db.Where("follower = ?", username).Find(&follows)
	if result.Error != nil {
		return nil, result.Error
	}
	return follows, nil
}

func (followDAO *FollowDAO) UserFollow(followee, follower string) error {
	follow := entity.Follow{
		Followee:   followee,
		Follower:   follower,
		Create_Day: time.Now().Format("2006-01-02"),
	}

	result := followDAO.db.Create(&follow)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (followDAO *FollowDAO) UserUnfollow(followee, follower string) error {
	result := followDAO.db.Where("Followee = ? and Follower = ?", followee, follower).Delete(&entity.Follow{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (followDAO *FollowDAO) DeleteFollow(username string) error {
	var result *gorm.DB
	result = followDAO.db.Where("Follower = ?", username).Delete(&entity.Follow{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}
