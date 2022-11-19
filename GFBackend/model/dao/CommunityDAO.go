package dao

import (
	"GFBackend/entity"
	"GFBackend/model"
	"gorm.io/gorm"
	"sync"
)

var communityDAO *CommunityDAO
var communityDAOLock sync.Mutex

type ICommunityDAO interface {
	CreateCommunity(communityName, username, description, createDay string) (int, error)
	DeleteCommunityByID(id int) error
	UpdateDescriptionByID(id int, newDescription string) error
	GetOneCommunityByID(id int) (entity.Community, error)
	GetCommunitiesByNameFuzzyMatch(name string, offset, limit int) ([]entity.Community, error)
	CountByNameFuzzyMatch(name string) (int64, error)
	GetCommunities(offset, limit int) ([]entity.Community, error)
	CountCommunities() (int64, error)
	GetCommunitiesByCreator(creator string, offset, limit int) ([]entity.Community, error)
}

type CommunityDAO struct {
	db *gorm.DB
}

func NewCommunityDAO() *CommunityDAO {
	if communityDAO == nil {
		communityDAOLock.Lock()
		if communityDAO == nil {
			communityDAO = &CommunityDAO{
				db: model.NewDB(),
			}
		}
		communityDAOLock.Unlock()
	}
	return communityDAO
}

func (communityDAO *CommunityDAO) CreateCommunity(communityName, username, description, createDay string) (int, error) {
	newCommunity := entity.Community{
		Creator:     username,
		Name:        communityName,
		Description: description,
		CreateDay:   createDay,
	}
	result := communityDAO.db.Create(&newCommunity)
	if result.Error != nil {
		return -1, result.Error
	}
	return newCommunity.ID, nil
}

func (communityDAO *CommunityDAO) DeleteCommunityByID(id int) error {
	result := communityDAO.db.Where("ID = ?", id).Delete(&entity.Community{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (communityDAO *CommunityDAO) UpdateDescriptionByID(id int, newDescription string) error {
	result := communityDAO.db.Model(&entity.Community{}).
		Where("id = ?", id).Update("Description", newDescription)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (communityDAO *CommunityDAO) GetOneCommunityByID(id int) (entity.Community, error) {
	var community entity.Community
	result := communityDAO.db.Where("ID = ?", id).First(&community)
	if result.Error != nil {
		return entity.Community{}, result.Error
	}
	return community, nil
}

func (communityDAO *CommunityDAO) GetCommunitiesByNameFuzzyMatch(name string, offset, limit int) ([]entity.Community, error) {
	var communities []entity.Community
	result := communityDAO.db.Limit(limit).Offset(offset).Where("Name LIKE ?", "%"+name+"%").Find(&communities)
	if result.Error != nil {
		return communities, result.Error
	}
	return communities, nil
}

func (communityDAO *CommunityDAO) CountByNameFuzzyMatch(name string) (int64, error) {
	var count int64
	result := communityDAO.db.Model(&entity.Community{}).Where("Name LIKE ?", "%"+name+"%").Count(&count)
	if result.Error != nil {
		return -1, result.Error
	}
	return count, nil
}

func (communityDAO *CommunityDAO) GetCommunities(offset, limit int) ([]entity.Community, error) {
	var communities []entity.Community
	result := communityDAO.db.Limit(limit).Offset(offset).Find(&communities)
	if result.Error != nil {
		return communities, result.Error
	}
	return communities, nil
}

func (communityDAO *CommunityDAO) GetCommunitiesByCreator(creator string, offset, limit int) ([]entity.Community, error) {
	var communities []entity.Community
	result := communityDAO.db.Limit(limit).Offset(offset).Where("Creator = ?", creator).Find(&communities)
	if result.Error != nil {
		return communities, result.Error
	}
	return communities, nil
}

func (communityDAO *CommunityDAO) CountCommunities() (int64, error) {
	var count int64
	result := communityDAO.db.Model(&entity.Community{}).Count(&count)
	if result.Error != nil {
		return -1, result.Error
	}
	return count, nil
}
