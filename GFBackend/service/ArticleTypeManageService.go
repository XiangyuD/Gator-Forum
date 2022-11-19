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

var articleTypeManageServiceLock sync.Mutex
var articleTypeManageService *ArticleTypeManageService

type IArticleTypeManageService interface {
	CreateArticleType(username, typeName, description string) error
	RemoveArticleType(typeName string) error
	GetArticleTypes() ([]entity.ArticleType, error)
	UpdateArticleTypeDescription(typeName, newDescription string) error
}

type ArticleTypeManageService struct {
	articleTypeDAO dao.IArticleTypeDAO
}

func NewArticleTypeManageService(articleTypeDAO dao.IArticleTypeDAO) *ArticleTypeManageService {
	if articleTypeManageService == nil {
		articleTypeManageServiceLock.Lock()
		if articleTypeManageService == nil {
			articleTypeManageService = &ArticleTypeManageService{
				articleTypeDAO: articleTypeDAO,
			}
		}
		articleTypeManageServiceLock.Unlock()
	}
	return articleTypeManageService
}

var ArticleTypeManageServiceSet = wire.NewSet(
	dao.NewArticleTypeDAO,
	wire.Bind(new(dao.IArticleTypeDAO), new(*dao.ArticleTypeDAO)),
	NewArticleTypeManageService,
)

func (articleTypeManageService *ArticleTypeManageService) CreateArticleType(username, typeName, description string) error {
	var newArticleType = entity.ArticleType{
		TypeName:    typeName,
		Description: description,
		Creator:     username,
		Create_Day:  utils.GetCurrentDate(),
	}
	if err1 := articleTypeManageService.articleTypeDAO.CreateArticleType(newArticleType); err1 != nil {
		if strings.Contains(err1.Error(), "Duplicate") {
			return errors.New("400")
		} else {
			logger.AppLogger.Error(err1.Error())
			return errors.New("500")
		}
	}
	return nil
}

func (articleTypeManageService *ArticleTypeManageService) GetArticleTypes() ([]entity.ArticleType, error) {
	articleTypes, err1 := articleTypeManageService.articleTypeDAO.GetArticleTypes()
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return nil, err1
	}
	return articleTypes, nil
}

func (articleTypeManageService *ArticleTypeManageService) RemoveArticleType(typeName string) error {
	err1 := articleTypeManageService.articleTypeDAO.RemoveArticleType(typeName)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return errors.New("500")
	}
	return nil
}

func (articleTypeManageService *ArticleTypeManageService) UpdateArticleTypeDescription(typeName, newDescription string) error {
	err1 := articleTypeManageService.articleTypeDAO.UpdateDescription(typeName, newDescription)
	if err1 != nil {
		return err1
	}
	return nil
}
