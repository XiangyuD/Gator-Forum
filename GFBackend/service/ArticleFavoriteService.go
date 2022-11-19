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

var articleFavoriteServiceLock sync.Mutex
var articleFavoriteService *ArticleFavoriteService

type IArticleFavoriteService interface {
	CreateFavorite(username string, articleID int) error
	DeleteFavorite(username string, articleID int) error
	GetUserFavorites(username string, pageNO, pageSize int) (entity.ArticleFavoritesInfo, []entity.ArticleDetail, error)
	GetFavoriteOfArticle(articleID int) ([]entity.ArticleFavorite, error)
}

type ArticleFavoriteService struct {
	articleDAO         dao.IArticleDAO
	articleFavoriteDAO dao.IArticleFavoriteDAO
}

func NewArticleFavoriteService(articleFavoriteDAO dao.IArticleFavoriteDAO, articleDAO dao.IArticleDAO) *ArticleFavoriteService {
	if articleFavoriteService == nil {
		articleFavoriteServiceLock.Lock()
		if articleFavoriteService == nil {
			articleFavoriteService = &ArticleFavoriteService{
				articleDAO:         articleDAO,
				articleFavoriteDAO: articleFavoriteDAO,
			}
		}
		articleFavoriteServiceLock.Unlock()
	}
	return articleFavoriteService
}

var ArticleFavoriteServiceSet = wire.NewSet(
	dao.NewArticleDAO,
	wire.Bind(new(dao.IArticleDAO), new(*dao.ArticleDAO)),
	dao.NewArticleFavoriteDAO,
	wire.Bind(new(dao.IArticleFavoriteDAO), new(*dao.ArticleFavoriteDAO)),
	NewArticleFavoriteService,
)

func (articleFavoriteService *ArticleFavoriteService) CreateFavorite(username string, articleID int) error {
	_, err1 := articleFavoriteService.articleDAO.GetArticleByID(articleID)
	if err1 != nil {
		if strings.Contains(err1.Error(), "not found") {
			return errors.New("400")
		}
		logger.AppLogger.Error(err1.Error())
		return errors.New("500")
	}

	err2 := articleFavoriteService.articleFavoriteDAO.CreateFavorite(username, articleID, utils.GetCurrentDate())
	if err2 != nil {
		if strings.Contains(err2.Error(), "Duplicate") {
			return errors.New("400")
		}
		logger.AppLogger.Error(err1.Error())
		return errors.New("500")
	}

	return nil
}

func (articleFavoriteService *ArticleFavoriteService) DeleteFavorite(username string, articleID int) error {
	articleFavorite, err1 := articleFavoriteService.articleFavoriteDAO.GetOne(username, articleID)
	if err1 != nil {
		if strings.Contains(err1.Error(), "not found") {
			return errors.New("400")
		}
		logger.AppLogger.Error(err1.Error())
		return errors.New("500")
	}

	if articleFavorite.Username == username {
		err2 := articleFavoriteService.articleFavoriteDAO.DeleteFavorite(username, articleID)
		if err2 != nil {
			logger.AppLogger.Error(err1.Error())
			return errors.New("500")
		}
	}

	return nil
}

func (articleFavoriteService *ArticleFavoriteService) GetUserFavorites(username string, pageNO, pageSize int) (entity.ArticleFavoritesInfo, []entity.ArticleDetail, error) {
	favorites, err1 := articleFavoriteService.articleFavoriteDAO.GetFavoritesByUsername(username, (pageNO-1)*pageSize, pageSize)
	if err1 != nil {
		if strings.Contains(err1.Error(), "not found") {
			return entity.ArticleFavoritesInfo{}, nil, errors.New("400")
		}
		logger.AppLogger.Error(err1.Error())
		return entity.ArticleFavoritesInfo{}, nil, errors.New("500")
	}

	count, err2 := articleFavoriteService.articleFavoriteDAO.CountFavoritesByUsername(username)
	if err2 != nil {
		if strings.Contains(err1.Error(), "not found") {
			return entity.ArticleFavoritesInfo{}, nil, errors.New("400")
		}
		logger.AppLogger.Error(err2.Error())
		return entity.ArticleFavoritesInfo{}, nil, errors.New("500")
	}
	var articleDetails []entity.ArticleDetail
	for i := 0; i < len(favorites); i++ {
		article, err3 := articleManageService.articleDAO.GetArticleByID(favorites[i].ArticleID)
		if err3 != nil {
			if strings.Contains(err3.Error(), "not found") {
				return entity.ArticleFavoritesInfo{}, nil, errors.New("400")
			}
			logger.AppLogger.Error(err3.Error())
			return entity.ArticleFavoritesInfo{}, nil, errors.New("500")
		}
		articleType, err4 := articleManageService.articleTypeDAO.GetArticleTypeByID(article.TypeID)
		if err4 != nil {
			if strings.Contains(err4.Error(), "not found") {
				return entity.ArticleFavoritesInfo{}, nil, errors.New("400")
			}
			logger.AppLogger.Error(err4.Error())
			return entity.ArticleFavoritesInfo{}, nil, errors.New("500")
		}
		community, err5 := articleManageService.communityDAO.GetOneCommunityByID(article.CommunityID)
		if err5 != nil {
			if strings.Contains(err5.Error(), "not found") {
				return entity.ArticleFavoritesInfo{}, nil, errors.New("400")
			}
			logger.AppLogger.Error(err5.Error())
			return entity.ArticleFavoritesInfo{}, nil, errors.New("500")
		}
		countLikeOfArticle, err6 := articleManageService.articleLikeDAO.CountLikeOfArticle(article.ID)
		if err6 != nil {
			logger.AppLogger.Error(err6.Error())
			return entity.ArticleFavoritesInfo{}, nil, errors.New("500")
		}
		countFavoriteOfArticle, err7 := articleManageService.articleFavoriteDAO.CountFavoriteOfArticle(article.ID)
		if err7 != nil {
			logger.AppLogger.Error(err7.Error())
			return entity.ArticleFavoritesInfo{}, nil, errors.New("500")
		}
		countCommentsOfArticle, err8 := articleManageService.articleCommentDAO.CountCommentsOfArticle(article.ID)
		if err8 != nil {
			logger.AppLogger.Error(err8.Error())
			return entity.ArticleFavoritesInfo{}, nil, errors.New("500")
		}
		articleDetails = append(articleDetails, entity.ArticleDetail{
			ID:            article.ID,
			Owner:         article.Username,
			Title:         article.Title,
			TypeName:      articleType.TypeName,
			CommunityName: community.Name,
			Content:       article.Content,
			Liked:         false,
			Favorited:     false,
			NumLike:       countLikeOfArticle,
			NumFavorite:   countFavoriteOfArticle,
			NumComment:    countCommentsOfArticle,
			UpdatedAt:     article.CreateDay,
		})
	}

	totalPageNO := count / int64(pageSize)
	if count%int64(pageSize) != 0 {
		totalPageNO += 1
	}

	return entity.ArticleFavoritesInfo{
		PageNO:           pageNO,
		PageSize:         pageSize,
		TotalPageNO:      totalPageNO,
		ArticleFavorites: favorites,
	}, articleDetails, nil
}

func (articleFavoriteService *ArticleFavoriteService) GetFavoriteOfArticle(articleID int) ([]entity.ArticleFavorite, error) {
	favorites, err1 := articleFavoriteService.articleFavoriteDAO.GetFavoriteOfArticle(articleID)
	if err1 != nil {
		if strings.Contains(err1.Error(), "not found") {
			return []entity.ArticleFavorite{}, errors.New("400")
		}
		logger.AppLogger.Error(err1.Error())
		return []entity.ArticleFavorite{}, errors.New("500")
	}

	return favorites, nil
}
