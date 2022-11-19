package dao

import (
	"GFBackend/entity"
	"GFBackend/model"
	"gorm.io/gorm"
	"sync"
)

var articleLikeDAOLock sync.Mutex
var articleLikeDAO *ArticleLikeDAO

type IArticleLikeDAO interface {
	CreateLike(username string, articleID int, likeDay string) error
	DeleteLike(username string, articleID int) error
	DeleteLikeByArticleID(articleID int) error
	GetLike(username string, articleID int) (entity.ArticleLike, error)
	CountLikeOfArticle(articleID int) (int64, error)
	GetLikeList(articleID int) ([]entity.ArticleLike, error)
}

type ArticleLikeDAO struct {
	db *gorm.DB
}

func NewArticleLikeDAO() *ArticleLikeDAO {
	if articleLikeDAO == nil {
		articleLikeDAOLock.Lock()
		if articleLikeDAO == nil {
			articleLikeDAO = &ArticleLikeDAO{
				db: model.NewDB(),
			}
		}
		articleLikeDAOLock.Unlock()
	}
	return articleLikeDAO
}

func (articleLikeDAO *ArticleLikeDAO) CreateLike(username string, articleID int, likeDay string) error {
	result := articleLikeDAO.db.Omit("ID").Create(&entity.ArticleLike{
		Username:  username,
		ArticleID: articleID,
		LikeDay:   likeDay,
	})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleLikeDAO *ArticleLikeDAO) DeleteLike(username string, articleID int) error {
	result := articleLikeDAO.db.Where("Username = ? AND ArticleID = ?", username, articleID).Delete(&entity.ArticleLike{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleLikeDAO *ArticleLikeDAO) DeleteLikeByArticleID(articleID int) error {
	result := articleLikeDAO.db.Where("ArticleID = ?", articleID).Delete(&entity.ArticleLike{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleLikeDAO *ArticleLikeDAO) GetLike(username string, articleID int) (entity.ArticleLike, error) {
	var articleLike entity.ArticleLike
	result := articleLikeDAO.db.Where("Username = ? AND ArticleID = ?", username, articleID).First(&articleLike)
	if result.Error != nil {
		return entity.ArticleLike{
			Username:  "",
			ArticleID: 0,
			LikeDay:   "",
		}, result.Error
	}
	return articleLike, nil
}

func (articleLikeDAO *ArticleLikeDAO) CountLikeOfArticle(articleID int) (int64, error) {
	var count int64
	result := articleLikeDAO.db.Model(&entity.ArticleLike{}).Where("ArticleID = ?", articleID).Count(&count)
	if result.Error != nil {
		return -1, result.Error
	}
	return count, nil
}

func (articleLikeDAO *ArticleLikeDAO) GetLikeList(articleID int) ([]entity.ArticleLike, error) {
	var articleLikeList []entity.ArticleLike
	result := articleLikeDAO.db.Where("ArticleID = ?", articleID).Find(&articleLikeList)
	if result.Error != nil {
		return nil, result.Error
	}
	return articleLikeList, nil
}
