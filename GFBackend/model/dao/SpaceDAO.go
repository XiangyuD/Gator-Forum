package dao

import (
	"GFBackend/entity"
	"GFBackend/model"
	"gorm.io/gorm"
	"sync"
)

var spaceDAOLock sync.Mutex
var spaceDAO *SpaceDAO

type ISpaceDAO interface {
	CreateSpaceInfo(username string) error
	DeleteSpaceInfo(username string) error
	UpdateUsed(username string, remainingSize float64) error
	UpdateCapacity(username string, newCapacity float64) error
	GetSpaceInfo(username string) (entity.Space, error)
}

type SpaceDAO struct {
	db *gorm.DB
}

func NewSpaceDAO() *SpaceDAO {
	if spaceDAO == nil {
		spaceDAOLock.Lock()
		if spaceDAO == nil {
			spaceDAO = &SpaceDAO{
				db: model.NewDB(),
			}
		}
		spaceDAOLock.Unlock()
	}
	return spaceDAO
}

func (spaceDAO *SpaceDAO) CreateSpaceInfo(username string) error {
	var result *gorm.DB
	result = spaceDAO.db.Select("Username").Create(&entity.Space{
		Username: username,
	})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (spaceDAO *SpaceDAO) DeleteSpaceInfo(username string) error {
	var result *gorm.DB
	result = spaceDAO.db.Where("Username = ?", username).Delete(&entity.Space{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (spaceDAO *SpaceDAO) UpdateUsed(username string, usedSize float64) error {
	var result *gorm.DB
	result = spaceDAO.db.Model(&entity.Space{}).Where("username = ?", username).Update("Remaining", usedSize)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (spaceDAO *SpaceDAO) UpdateCapacity(username string, newCapacity float64) error {
	var result *gorm.DB
	result = spaceDAO.db.Model(&entity.Space{}).Where("username = ?", username).Update("Capacity", newCapacity)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (spaceDAO *SpaceDAO) GetSpaceInfo(username string) (entity.Space, error) {
	spaceInfo := entity.Space{}
	result := spaceDAO.db.Where("username = ?", username).First(&spaceInfo)
	if result.Error != nil {
		return spaceInfo, result.Error
	}
	return spaceInfo, nil
}
