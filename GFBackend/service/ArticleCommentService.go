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

var articleCommentServiceLock sync.Mutex
var articleCommentService *ArticleCommentService

type IArticleCommentService interface {
	CreateComment(username string, articleID, commentID int, content string) error
	DeleteCommentByID(id int, operator string) error
	GetCommentsByArticleID(articleID, pageNo, pageSize int) (entity.ArticleCommentsInfo, error)
	GetSubCommentsByArticleIDAndCommentID(articleID, commentID, pageNo, pageSize int) (entity.ArticleCommentsInfo, error)
}

type ArticleCommentService struct {
	articleDAO        dao.IArticleDAO
	articleCommentDAO dao.IArticleCommentDAO
}

func NewArticleCommentService(articleCommentDAO dao.IArticleCommentDAO, articleDAO dao.IArticleDAO) *ArticleCommentService {
	if articleCommentService == nil {
		articleCommentServiceLock.Lock()
		if articleCommentService == nil {
			articleCommentService = &ArticleCommentService{
				articleDAO:        articleDAO,
				articleCommentDAO: articleCommentDAO,
			}
		}
		articleCommentServiceLock.Unlock()
	}
	return articleCommentService
}

var ArticleCommentServiceSet = wire.NewSet(
	dao.NewArticleDAO,
	wire.Bind(new(dao.IArticleDAO), new(*dao.ArticleDAO)),
	dao.NewArticleCommentDAO,
	wire.Bind(new(dao.IArticleCommentDAO), new(*dao.ArticleCommentDAO)),
	NewArticleCommentService,
)

func (articleCommentService *ArticleCommentService) CreateComment(username string, articleID, commentID int, content string) error {
	_, err1 := articleCommentService.articleDAO.GetArticleByID(articleID)
	if err1 != nil {
		if strings.Contains(err1.Error(), "not found") {
			return errors.New("400")
		}
		logger.AppLogger.Error(err1.Error())
		return errors.New("500")
	}

	var comment entity.ArticleComment
	if commentID != 0 {
		_, err2 := articleCommentService.articleCommentDAO.GetOneCommentByID(commentID)
		if err2 != nil {
			if strings.Contains(err2.Error(), "not found") {
				return errors.New("400")
			}
			logger.AppLogger.Error(err2.Error())
			return errors.New("500")
		}
		comment.CommentID = commentID
	}

	comment.Username = username
	comment.ArticleID = articleID
	comment.Content = content
	comment.CreateDay = utils.GetCurrentDate()
	err3 := articleCommentService.articleCommentDAO.CreateComment(comment)
	if err3 != nil {
		logger.AppLogger.Error(err3.Error())
		return errors.New("500")
	}

	return nil
}

func (articleCommentService *ArticleCommentService) DeleteCommentByID(id int, operator string) error {
	comment, err1 := articleCommentService.articleCommentDAO.GetOneCommentByID(id)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return err1
	}

	if comment.Username == operator {
		err2 := articleCommentService.articleCommentDAO.DeleteCommentByID(id)
		if err2 != nil {
			logger.AppLogger.Error(err2.Error())
			return err2
		}

		err3 := articleCommentService.articleCommentDAO.DeleteSubCommentByCommentID(id)
		if err3 != nil {
			logger.AppLogger.Error(err3.Error())
			return err3
		}
	}

	return nil
}

func (articleCommentService *ArticleCommentService) GetCommentsByArticleID(articleID, pageNo, pageSize int) (entity.ArticleCommentsInfo, error) {
	comments, err1 := articleCommentService.articleCommentDAO.GetCommentsByArticleID(articleID, (pageNo-1)*pageSize, pageSize)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return entity.ArticleCommentsInfo{}, errors.New("500")
	}

	count, err2 := articleCommentService.articleCommentDAO.CountCommentsByArticleID(articleID)
	if err2 != nil {
		logger.AppLogger.Error(err2.Error())
		return entity.ArticleCommentsInfo{}, errors.New("500")
	}

	totalPageNO := count / int64(pageSize)
	if count%int64(pageSize) != 0 {
		totalPageNO += 1
	}

	return entity.ArticleCommentsInfo{
		PageNO:          pageNo,
		PageSize:        pageSize,
		TotalPageNO:     totalPageNO,
		ArticleComments: comments,
	}, nil
}

func (articleCommentService *ArticleCommentService) GetSubCommentsByArticleIDAndCommentID(articleID, commentID, pageNo, pageSize int) (entity.ArticleCommentsInfo, error) {
	comments, err1 := articleCommentService.articleCommentDAO.GetSubCommentsByArticleIDAndCommentID(articleID, commentID, (pageNo-1)*pageSize, pageSize)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return entity.ArticleCommentsInfo{}, errors.New("500")
	}

	count, err2 := articleCommentService.articleCommentDAO.CountSubCommentsByArticleIDAndCommentID(articleID, commentID)
	if err2 != nil {
		logger.AppLogger.Error(err2.Error())
		return entity.ArticleCommentsInfo{}, errors.New("500")
	}

	totalPageNO := count / int64(pageSize)
	if count%int64(pageSize) != 0 {
		totalPageNO += 1
	}

	return entity.ArticleCommentsInfo{
		PageNO:          pageNo,
		PageSize:        pageSize,
		TotalPageNO:     totalPageNO,
		ArticleComments: comments,
	}, nil
}
