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

var communityManageServiceLock sync.Mutex
var communityManageService *CommunityManageService

type ICommunityManageService interface {
	CreateCommunity(creator string, name string, description string) (int, error)
	DeleteCommunityByID(id int, operator string) error
	UpdateDescriptionByID(id int, newDescription, operator string) error
	GetNumberOfMembersByID(id int) (int64, error)
	GetOneCommunityByID(id int, username string, pageNO, pageSize int) (entity.Community, int64, bool, error)
	GetCommunitiesByNameFuzzyMatch(name string, pageNO, pageSize int) ([]entity.Community, int64, error)
	GetCommunities(pageNO, pageSize int) ([]entity.Community, int64, error)
	JoinCommunityByID(id int, username string) error
	LeaveCommunityByID(id int, username string) error
	GetMembersByCommunityIDs(id int, pageNO, pageSize int) ([]entity.CommunityMember, error)
	GetCommunityIDsByMember(username string, pageNO, pageSize int) ([]entity.Community, error)
	GetCommunitiesByCreator(creator string, pageNO, pageSize int) ([]entity.Community, []int64, []int64, error)
}

type CommunityManageService struct {
	communityDAO       dao.ICommunityDAO
	communityMemberDAO dao.ICommunityMemberDAO
	articleDAO         dao.IArticleDAO
}

func NewCommunityManageService(communityDAO dao.ICommunityDAO, communityMemberDAO dao.ICommunityMemberDAO, articleDAO dao.IArticleDAO) *CommunityManageService {
	if communityManageService == nil {
		communityManageServiceLock.Lock()
		if communityManageService == nil {
			communityManageService = &CommunityManageService{
				communityDAO:       communityDAO,
				communityMemberDAO: communityMemberDAO,
			}
		}
		if articleDAO != nil {
			communityManageService.articleDAO = articleDAO
		}
		communityManageServiceLock.Unlock()
	}
	return communityManageService
}

var CommunityManageServiceSet = wire.NewSet(
	dao.NewCommunityMemberDAO,
	wire.Bind(new(dao.ICommunityMemberDAO), new(*dao.CommunityMemberDAO)),
	dao.NewCommunityDAO,
	wire.Bind(new(dao.ICommunityDAO), new(*dao.CommunityDAO)),
	dao.NewArticleDAO,
	wire.Bind(new(dao.IArticleDAO), new(*dao.ArticleDAO)),
	NewCommunityManageService,
)

func (communityManageService *CommunityManageService) CreateCommunity(creator, name, description string) (int, error) {
	newCommunityID, err1 := communityManageService.communityDAO.CreateCommunity(name, creator, description, utils.GetCurrentDate())
	if err1 != nil {
		if strings.Contains(err1.Error(), "Duplicate") {
			return -1, errors.New("400")
		}
		logger.AppLogger.Error(err1.Error())
		return -1, errors.New("500")
	}

	err2 := communityManageService.communityMemberDAO.Create(newCommunityID, creator, utils.GetCurrentDate())
	if err2 != nil {
		logger.AppLogger.Error(err2.Error())
		return -1, errors.New("500")
	}

	return newCommunityID, nil
}

func (communityManageService *CommunityManageService) DeleteCommunityByID(id int, operator string) error {
	community, err1 := communityManageService.communityDAO.GetOneCommunityByID(id)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return err1
	}
	if community.Creator == operator {
		err2 := communityManageService.communityDAO.DeleteCommunityByID(id)
		if err2 != nil {
			logger.AppLogger.Error(err2.Error())
		}

		err3 := communityManageService.communityMemberDAO.DeleteByCommunityID(id)
		if err3 != nil {
			logger.AppLogger.Error(err3.Error())
		}
	}

	return nil
}

func (communityManageService *CommunityManageService) UpdateDescriptionByID(id int, newDescription, operator string) error {
	community, err1 := communityManageService.communityDAO.GetOneCommunityByID(id)
	if err1 != nil {
		if strings.Contains(err1.Error(), "not found") {
			return errors.New("400")
		}
		logger.AppLogger.Error(err1.Error())
		return errors.New("500")
	}
	if community.Creator == operator {
		err2 := communityManageService.communityDAO.UpdateDescriptionByID(id, newDescription)
		if err2 != nil {
			logger.AppLogger.Error(err2.Error())
			return errors.New("500")
		}
	} else {
		return errors.New("400")
	}
	return nil
}

func (communityManageService *CommunityManageService) GetNumberOfMembersByID(id int) (int64, error) {
	count, err1 := communityManageService.communityMemberDAO.CountMemberByCommunityID(id)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return 0, err1
	}
	return count, nil
}

func (communityManageService *CommunityManageService) GetOneCommunityByID(id int, username string, pageNO, pageSize int) (entity.Community, int64, bool, error) {
	community, err1 := communityManageService.communityDAO.GetOneCommunityByID(id)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return entity.Community{}, 0, false, err1
	}
	count, err2 := communityManageService.communityMemberDAO.CountMemberByCommunityID(id)
	if err2 != nil {
		logger.AppLogger.Error(err2.Error())
		return entity.Community{}, 0, false, err2
	}
	memberList, err3 := communityManageService.communityMemberDAO.GetMembersByCommunityIDs(id, (pageNO-1)*pageSize, pageSize)
	if err3 != nil {
		logger.AppLogger.Error(err3.Error())
		return entity.Community{}, 0, true, err3
	}
	for i := 0; i < len(memberList); i++ {
		if memberList[i].Member == username {
			return community, count, true, nil
		} else {
			return community, count, false, nil
		}
	}
	return community, count, true, nil
}

func (communityManageService *CommunityManageService) GetCommunitiesByNameFuzzyMatch(name string, pageNO, pageSize int) ([]entity.Community, int64, error) {
	communities, err1 := communityManageService.communityDAO.GetCommunitiesByNameFuzzyMatch(name, (pageNO-1)*pageSize, pageSize)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return nil, -1, err1
	}

	count, err := communityManageService.communityDAO.CountByNameFuzzyMatch(name)
	if err != nil {
		logger.AppLogger.Error(err1.Error())
		return nil, -1, err1
	}
	totalPageNO := count / int64(pageSize)
	if count%int64(pageSize) != 0 {
		totalPageNO += 1
	}

	return communities, totalPageNO, nil
}

func (communityManageService *CommunityManageService) GetCommunities(pageNO, pageSize int) ([]entity.Community, int64, error) {
	communities, err1 := communityManageService.communityDAO.GetCommunities((pageNO-1)*pageSize, pageSize)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return nil, -1, err1
	}

	count, err := communityManageService.communityDAO.CountCommunities()
	if err != nil {
		logger.AppLogger.Error(err1.Error())
		return nil, -1, err1
	}
	totalPageNO := count / int64(pageSize)
	if count%int64(pageSize) != 0 {
		totalPageNO += 1
	}

	return communities, totalPageNO, nil
}

func (communityManageService *CommunityManageService) GetCommunitiesByCreator(creator string, pageNO, pageSize int) ([]entity.Community, []int64, []int64, error) {
	communities, err1 := communityManageService.communityDAO.GetCommunitiesByCreator(creator, (pageNO-1)*pageSize, pageSize)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return nil, nil, nil, err1
	}
	var num_member []int64
	for i := 0; i < len(communities); i++ {
		count, err2 := communityManageService.communityMemberDAO.CountMemberByCommunityID(communities[i].ID)
		if err2 != nil {
			logger.AppLogger.Error(err2.Error())
			return nil, nil, nil, err2
		}
		num_member = append(num_member, count)
	}
	var num_post []int64
	for i := 0; i < len(communities); i++ {
		count, err2 := communityManageService.articleDAO.CountArticleByCommunityID(communities[i].ID)
		if err2 != nil {
			logger.AppLogger.Error(err2.Error())
			return nil, nil, nil, err2
		}
		num_post = append(num_post, count)
	}

	return communities, num_member, num_post, nil
}

func (communityManageService *CommunityManageService) JoinCommunityByID(id int, username string) error {
	_, err1 := communityManageService.communityDAO.GetOneCommunityByID(id)
	if err1 != nil {
		if strings.Contains(err1.Error(), "not found") {
			return errors.New("400")
		}
		logger.AppLogger.Error(err1.Error())
		return err1
	}

	err2 := communityManageService.communityMemberDAO.Create(id, username, utils.GetCurrentDate())
	if err2 != nil {
		if strings.Contains(err2.Error(), "Duplicate") {
			return errors.New("400")
		}
		logger.AppLogger.Error(err2.Error())
		return err2
	}
	return nil
}

func (communityManageService *CommunityManageService) LeaveCommunityByID(id int, username string) error {
	err2 := communityManageService.communityMemberDAO.DeleteByCommunityIDAndMember(id, username)
	if err2 != nil {
		logger.AppLogger.Error(err2.Error())
	}
	return nil
}

func (communityManageService *CommunityManageService) GetMembersByCommunityIDs(id int, pageNO, pageSize int) ([]entity.CommunityMember, error) {
	members, err := communityManageService.communityMemberDAO.GetMembersByCommunityIDs(id, (pageNO-1)*pageSize, pageSize)
	if err != nil {
		logger.AppLogger.Error(err.Error())
		return nil, err
	}
	return members, nil
}

func (communityManageService *CommunityManageService) GetCommunityIDsByMember(username string, pageNO, pageSize int) ([]entity.Community, error) {
	members, err := communityManageService.communityMemberDAO.GetCommunityIDsByMember(username, (pageNO-1)*pageSize, pageSize)
	if err != nil {
		logger.AppLogger.Error(err.Error())
		return nil, err
	}
	var communities []entity.Community
	for i := 0; i < len(members); i++ {
		community, err1 := communityManageService.communityDAO.GetOneCommunityByID(members[i].CommunityID)
		if err1 != nil {
			logger.AppLogger.Error(err1.Error())
			return nil, err1
		}
		communities = append(communities, community)
	}
	return communities, nil
}
