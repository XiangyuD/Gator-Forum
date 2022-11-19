package service

import (
	"GFBackend/entity"
	"GFBackend/logger"
	"GFBackend/model/dao"
	"GFBackend/utils"
	"errors"
	"github.com/google/wire"
	"strings"
	"sync"
)

var articleLikeServiceLock sync.Mutex
var articleLikeService *ArticleLikeService

type IArticleLikeService interface {
	CreateLike(username string, articleID int) error
	DeleteLike(username string, articleID int) error
	GetLikeList(articleID int) ([]entity.ArticleLike, error)
}

type ArticleLikeService struct {
	articleDAO     dao.IArticleDAO
	articleLikeDAO dao.IArticleLikeDAO
}

func NewArticleLikeService(articleDAO dao.IArticleDAO, articleLikeDAO dao.IArticleLikeDAO) *ArticleLikeService {
	if articleLikeService == nil {
		articleLikeServiceLock.Lock()
		if articleLikeService == nil {
			articleLikeService = &ArticleLikeService{
				articleDAO:     articleDAO,
				articleLikeDAO: articleLikeDAO,
			}
		}
		articleLikeServiceLock.Unlock()
	}
	return articleLikeService
}

var ArticleLikeServiceSet = wire.NewSet(
	dao.NewArticleLikeDAO,
	wire.Bind(new(dao.IArticleLikeDAO), new(*dao.ArticleLikeDAO)),
	dao.NewArticleDAO,
	wire.Bind(new(dao.IArticleDAO), new(*dao.ArticleDAO)),
	NewArticleLikeService,
)

func (articleLikeService *ArticleLikeService) CreateLike(username string, articleID int) error {
	_, err1 := articleLikeService.articleDAO.GetArticleByID(articleID)
	if err1 != nil {
		if strings.Contains(err1.Error(), "not found") {
			return errors.New("400")
		}
		logger.AppLogger.Error(err1.Error())
		return errors.New("500")
	}

	err2 := articleLikeService.articleLikeDAO.CreateLike(username, articleID, utils.GetCurrentDate())
	if err2 != nil {
		logger.AppLogger.Error(err1.Error())
		return errors.New("500")
	}

	return nil
}

func (articleLikeService *ArticleLikeService) DeleteLike(username string, articleID int) error {
	articleLike, err1 := articleLikeService.articleLikeDAO.GetLike(username, articleID)
	if err1 != nil {
		if strings.Contains(err1.Error(), "not found") {
			return errors.New("400")
		}
		logger.AppLogger.Error(err1.Error())
		return errors.New("500")
	}

	if articleLike.Username == username {
		err2 := articleLikeService.articleLikeDAO.DeleteLike(username, articleID)
		if err2 != nil {
			logger.AppLogger.Error(err1.Error())
			return errors.New("500")
		}
	}

	return nil
}

func (articleLikeService *ArticleLikeService) GetLikeList(articleID int) ([]entity.ArticleLike, error) {
	articleLikeList, err := articleLikeService.articleLikeDAO.GetLikeList(articleID)
	if err != nil {
		logger.AppLogger.Error(err.Error())
		return nil, errors.New("500")
	}

	return articleLikeList, nil
}
