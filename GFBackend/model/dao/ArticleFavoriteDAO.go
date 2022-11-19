package dao

import (
	"GFBackend/entity"
	"GFBackend/model"
	"gorm.io/gorm"
	"sync"
)

var articleFavoriteDAOLock sync.Mutex
var articleFavoriteDAO *ArticleFavoriteDAO

type IArticleFavoriteDAO interface {
	CreateFavorite(username string, articleID int, favoriteDay string) error
	DeleteFavorite(username string, articleID int) error
	GetOne(username string, articleID int) (entity.ArticleFavorite, error)
	GetFavoritesByUsername(username string, offset, limit int) ([]entity.ArticleFavorite, error)
	CountFavoritesByUsername(username string) (int64, error)
	CountFavoriteOfArticle(articleID int) (int64, error)
	GetFavoriteOfArticle(articleID int) ([]entity.ArticleFavorite, error)
}

type ArticleFavoriteDAO struct {
	db *gorm.DB
}

func NewArticleFavoriteDAO() *ArticleFavoriteDAO {
	if articleFavoriteDAO == nil {
		articleFavoriteDAOLock.Lock()
		if articleFavoriteDAO == nil {
			articleFavoriteDAO = &ArticleFavoriteDAO{
				db: model.NewDB(),
			}
		}
		articleFavoriteDAOLock.Unlock()
	}
	return articleFavoriteDAO
}

func (articleFavoriteDAO *ArticleFavoriteDAO) CreateFavorite(username string, articleID int, favoriteDay string) error {
	result := articleFavoriteDAO.db.Omit("ID").Create(&entity.ArticleFavorite{
		Username:    username,
		ArticleID:   articleID,
		FavoriteDay: favoriteDay,
	})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleFavoriteDAO *ArticleFavoriteDAO) DeleteFavorite(username string, articleID int) error {
	result := articleFavoriteDAO.db.Where("Username = ? AND ArticleID = ?", username, articleID).Delete(&entity.ArticleFavorite{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleFavoriteDAO *ArticleFavoriteDAO) GetOne(username string, articleID int) (entity.ArticleFavorite, error) {
	var articleFavorite entity.ArticleFavorite
	result := articleFavoriteDAO.db.Where("Username = ? AND ArticleID = ?", username, articleID).First(&articleFavorite)
	if result.Error != nil {
		return entity.ArticleFavorite{
			Username:    "",
			ArticleID:   0,
			FavoriteDay: "",
		}, result.Error
	}
	return articleFavorite, nil
}

func (articleFavoriteDAO *ArticleFavoriteDAO) GetFavoritesByUsername(username string, offset, limit int) ([]entity.ArticleFavorite, error) {
	var articleFavorites []entity.ArticleFavorite
	result := articleFavoriteDAO.db.Limit(limit).Offset(offset).Where("Username = ?", username).Find(&articleFavorites)
	if result.Error != nil {
		return articleFavorites, result.Error
	}
	return articleFavorites, nil
}

func (articleFavoriteDAO *ArticleFavoriteDAO) CountFavoritesByUsername(username string) (int64, error) {
	var count int64
	result := articleFavoriteDAO.db.Model(&entity.ArticleFavorite{}).Where("Username = ?", username).Count(&count)
	if result.Error != nil {
		return -1, result.Error
	}
	return count, nil
}

func (articleFavoriteDAO *ArticleFavoriteDAO) CountFavoriteOfArticle(articleID int) (int64, error) {
	var count int64
	result := articleFavoriteDAO.db.Model(&entity.ArticleFavorite{}).Where("ArticleID = ?", articleID).Count(&count)
	if result.Error != nil {
		return -1, result.Error
	}
	return count, nil
}

func (articleFavoriteDAO *ArticleFavoriteDAO) GetFavoriteOfArticle(articleID int) ([]entity.ArticleFavorite, error) {
	var articleFavorites []entity.ArticleFavorite
	result := articleFavoriteDAO.db.Where("ArticleID = ?", articleID).Find(&articleFavorites)
	if result.Error != nil {
		return articleFavorites, result.Error
	}
	return articleFavorites, nil
}
