package dao

import (
	"GFBackend/entity"
	"GFBackend/model"
	"gorm.io/gorm"
	"sync"
)

var articleTypeDAOLock sync.Mutex
var articleTypeDAO *ArticleTypeDAO

type IArticleTypeDAO interface {
	CreateArticleType(articleType entity.ArticleType) error
	RemoveArticleType(typeName string) error
	UpdateDescription(typeName, newDescription string) error
	GetArticleTypes() ([]entity.ArticleType, error)
	GetArticleTypeByID(id int) (entity.ArticleType, error)
}

type ArticleTypeDAO struct {
	db *gorm.DB
}

func NewArticleTypeDAO() *ArticleTypeDAO {
	if articleTypeDAO == nil {
		articleTypeDAOLock.Lock()
		if articleTypeDAO == nil {
			articleTypeDAO = &ArticleTypeDAO{
				db: model.NewDB(),
			}
		}
		articleTypeDAOLock.Unlock()
	}
	return articleTypeDAO
}

func (articleTypeDAO *ArticleTypeDAO) CreateArticleType(articleType entity.ArticleType) error {
	result := articleTypeDAO.db.Omit("ID").Create(&articleType)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleTypeDAO *ArticleTypeDAO) RemoveArticleType(typeName string) error {
	result := articleTypeDAO.db.Where("typeName = ?", typeName).Delete(&entity.ArticleType{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleTypeDAO *ArticleTypeDAO) UpdateDescription(typeName, newDescription string) error {
	result := articleTypeDAO.db.Model(&entity.ArticleType{}).Where("typeName", typeName).Update("Description", newDescription)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleTypeDAO *ArticleTypeDAO) GetArticleTypes() ([]entity.ArticleType, error) {
	var articleTypes []entity.ArticleType
	result := articleTypeDAO.db.Find(&articleTypes)
	if result.Error != nil {
		return nil, result.Error
	}
	return articleTypes, nil
}

func (articleTypeDAO *ArticleTypeDAO) GetArticleTypeByID(id int) (entity.ArticleType, error) {
	var articleType entity.ArticleType
	result := articleTypeDAO.db.Where("ID = ?", id).First(&articleType)
	if result.Error != nil {
		return entity.ArticleType{}, result.Error
	}
	return articleType, nil
}
