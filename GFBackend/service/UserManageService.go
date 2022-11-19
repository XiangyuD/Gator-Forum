package service

import (
	"GFBackend/cache"
	"GFBackend/entity"
	"GFBackend/logger"
	"GFBackend/middleware/auth"
	"GFBackend/model/dao"
	"GFBackend/utils"
	"errors"
	"fmt"
	"github.com/google/wire"
	"strings"
	"sync"
)

var userManageServiceLock sync.Mutex
var userManageService *UserManageService

type IUserManageService interface {
	Register(username, password string, forAdmin bool) error
	Login(username, password string) (string, string, error)
	Logout(username string) error
	UpdatePassword(username, password, newPassword string) error
	Delete(username string) error
	Update(userInfo entity.User) error
	Follow(followee, follower string) error
	Unfollow(followee, follower string) error
	GetFollowers(username string) ([]string, error)
	GetFollowees(username string) ([]string, error)
	GetUserInfoByUsername(current_username string, target_username string) (entity.User, bool, bool, error)
	GetUsersInfoByUsernameFuzzySearch(username string, pageNo, pageSize int) ([]entity.User, error)
}

type UserManageService struct {
	communityMemberDAO dao.ICommunityMemberDAO
	userDAO            dao.IUserDAO
	followDAO          dao.IFollowDAO
	spaceDAO           dao.ISpaceDAO
}

func NewUserManageService(userDAO dao.IUserDAO, followDAO dao.IFollowDAO, spaceDAO dao.ISpaceDAO, communityMemberDAO dao.ICommunityMemberDAO) *UserManageService {
	if userManageService == nil {
		userManageServiceLock.Lock()
		if userManageService == nil {
			userManageService = &UserManageService{
				userDAO:            userDAO,
				followDAO:          followDAO,
				spaceDAO:           spaceDAO,
				communityMemberDAO: communityMemberDAO,
			}
		}
		userManageServiceLock.Unlock()
	}
	return userManageService
}

var UserManageServiceSet = wire.NewSet(
	dao.NewUserDAO,
	wire.Bind(new(dao.IUserDAO), new(*dao.UserDAO)),
	dao.NewFollowDAO,
	wire.Bind(new(dao.IFollowDAO), new(*dao.FollowDAO)),
	dao.NewSpaceDAO,
	wire.Bind(new(dao.ISpaceDAO), new(*dao.SpaceDAO)),
	dao.NewCommunityMemberDAO,
	wire.Bind(new(dao.ICommunityMemberDAO), new(*dao.CommunityMemberDAO)),
	NewUserManageService,
)

func (userManageService *UserManageService) Register(username, password string, forAdmin bool) error {
	salt := utils.GetRandomString(6)
	newUser := entity.User{
		Username: username,
		Password: utils.EncodeInMD5(password + salt),
		Salt:     salt,
	}

	createUserError := userManageService.userDAO.CreateUser(newUser)
	if createUserError != nil {
		logger.AppLogger.Error(fmt.Sprintf("Create User Error: %s", createUserError.Error()))
		return errors.New("500")
	}

	registrySpaceError := userManageService.spaceDAO.CreateSpaceInfo(username)
	if registrySpaceError != nil {
		logger.AppLogger.Error(fmt.Sprintf("Create Space Info Error: %s", createUserError.Error()))
		return errors.New("500")
	}

	createDirFlag := utils.CreateDir(username)
	if !createDirFlag {
		logger.AppLogger.Error("Create Dir Error for user: " + username)
		return errors.New("500")
	}

	role := "regular"
	if forAdmin {
		role = "admin"
	}
	_, CasbinAddPolicyError := auth.CasbinEnforcer.AddGroupingPolicy(username, role)
	if CasbinAddPolicyError != nil {
		logger.AppLogger.Error(fmt.Sprintf("Add New User Policy Error: %s", CasbinAddPolicyError.Error()))
		return errors.New("500")
	}

	return nil
}

func (userManageService *UserManageService) Login(username, password string) (string, string, error) {
	dbUser := userManageService.userDAO.GetUserByUsername(username)
	if dbUser.Username == "" {
		return "", "", errors.New("400")
	}

	inputPassword := utils.EncodeInMD5(password + dbUser.Salt)
	if inputPassword != dbUser.Password {
		return "", "", errors.New("400")
	}

	token, err := auth.TokenGenerate(username)
	if err != nil {
		logger.AppLogger.Error(err.Error())
		return "", "", errors.New("500")
	}

	sign, _ := auth.GetTokenSign(token.Token)
	err = cache.AddLoginUserWithSign(username, sign)
	if err != nil {
		logger.AppLogger.Error(err.Error())
		return "", "", errors.New("500")
	}

	return dbUser.Nickname, token.Token, nil
}

func (userManageService *UserManageService) Logout(username string) error {
	err := cache.DelLoginUserSign(username)
	if err != nil {
		if err != nil {
			logger.AppLogger.Error(err.Error())
		}
		return errors.New("")
	}
	return nil
}

func (userManageService *UserManageService) UpdatePassword(username, password, newPassword string) error {
	user := userManageService.userDAO.GetUserByUsername(username)

	if utils.EncodeInMD5(password+user.Salt) != user.Password {
		return errors.New("400")
	}

	err := userManageService.userDAO.UpdateUserPassword(username, utils.EncodeInMD5(newPassword+user.Salt))
	if err != nil {
		logger.AppLogger.Error(err.Error())
		return errors.New("500")
	}

	return nil
}

func (userManageService *UserManageService) Delete(username string) error {
	user := userManageService.userDAO.GetUserByUsername(username)
	if user.Username == "" {
		return errors.New("user does not exist")
	}

	deleteUserError := userManageService.userDAO.DeleteUserByUsername(username)
	if deleteUserError != nil {
		logger.AppLogger.Error(fmt.Sprintf("Delete User Error: %s", deleteUserError.Error()))
		return errors.New("500")
	}

	if !utils.DeleteDir(username) {
		logger.AppLogger.Error("Delete User Error for user: " + username)
		return errors.New("500")
	}

	DeleteSpaceError := userManageService.spaceDAO.DeleteSpaceInfo(username)
	if DeleteSpaceError != nil {
		logger.AppLogger.Error(DeleteSpaceError.Error())
		return errors.New("500")
	}

	deleteUserFollowError := userManageService.followDAO.DeleteFollow(username)
	if deleteUserFollowError != nil {
		logger.AppLogger.Error(fmt.Sprintf("Delete User Error: %s", deleteUserError.Error()))
		return errors.New("500")
	}

	deleteCommunityMemberError := userManageService.communityMemberDAO.DeleteByMember(username)
	if deleteCommunityMemberError != nil {
		logger.AppLogger.Error(deleteCommunityMemberError.Error())
		return errors.New("500")
	}

	_, CasbinAddPolicyError := auth.CasbinEnforcer.DeleteUser(username)
	if CasbinAddPolicyError != nil {
		logger.AppLogger.Error(fmt.Sprintf("Delete User Policy Error: %s", CasbinAddPolicyError.Error()))
		return errors.New("500")
	}

	return nil

}

func (userManageService *UserManageService) Update(userInfo entity.User) error {
	err := userManageService.userDAO.UpdateUserByUsername(userInfo)
	if err != nil {
		logger.AppLogger.Error(err.Error())
		return errors.New("500")
	}
	return nil
}

func (userManageService *UserManageService) Follow(followee, follower string) error {
	follow, err1 := userManageService.followDAO.GetOneFollow(followee, follower)
	if err1 != nil {
		if !strings.Contains(err1.Error(), "record not found") {
			logger.AppLogger.Error(err1.Error())
			return errors.New("500")
		}
	}

	if follow.Followee == followee {
		return errors.New("400")
	}

	followeeUserInfo := userManageService.userDAO.GetUserByUsername(followee)
	if followeeUserInfo.Username == "" {
		return errors.New("400")
	}

	err2 := userManageService.followDAO.UserFollow(followee, follower)
	if err2 != nil {
		logger.AppLogger.Error(err2.Error())
		return errors.New("500")
	}

	return nil
}

func (userManageService *UserManageService) Unfollow(followee, follower string) error {
	followeeUserInfo := userManageService.userDAO.GetUserByUsername(followee)
	if followeeUserInfo.Username == "" {
		return errors.New("400")
	}

	err1 := userManageService.followDAO.UserUnfollow(followee, follower)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return errors.New("500")
	}
	return nil
}

func (userManageService *UserManageService) GetFollowers(username string) ([]string, error) {
	follows, err1 := userManageService.followDAO.GetFollowers(username)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return nil, errors.New("500")
	}
	var followers []string
	for _, follow := range follows {
		followers = append(followers, follow.Follower)
	}
	return followers, nil
}

func (userManageService *UserManageService) GetFollowees(username string) ([]string, error) {
	follows, err1 := userManageService.followDAO.GetFollowees(username)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return nil, errors.New("500")
	}
	var followees []string
	for _, follow := range follows {
		followees = append(followees, follow.Followee)
	}
	return followees, nil
}

func (userManageService *UserManageService) GetUserInfoByUsername(current_username string, target_username string) (entity.User, bool, bool, error) {
	userInfo, err1 := userManageService.userDAO.GetUserInfoByUsername(target_username)
	if err1 != nil {
		logger.AppLogger.Error(err1.Error())
		return entity.User{}, false, false, errors.New("500")
	}
	follower, err2 := userManageService.followDAO.GetFollowers(current_username)
	if err2 != nil {
		logger.AppLogger.Error(err2.Error())
		return entity.User{}, false, false, errors.New("500")
	}
	followee, err3 := userManageService.followDAO.GetFollowers(target_username)
	if err3 != nil {
		logger.AppLogger.Error(err3.Error())
		return entity.User{}, false, false, errors.New("500")
	}
	var isFollowed bool
	var isFollowother bool
	for i := 0; i < len(follower); i++ {
		if follower[i].Follower == target_username {
			isFollowed = true
		}
	}
	for i := 0; i < len(followee); i++ {
		if followee[i].Follower == current_username {
			isFollowother = true
		}
	}
	return userInfo, isFollowed, isFollowother, nil
}

func (userManageService *UserManageService) GetUsersInfoByUsernameFuzzySearch(username string, pageNo, pageSize int) ([]entity.User, error) {
	users, getUserErr := userManageService.userDAO.GetUsersByUsernameFuzzySearch(username, (pageNo-1)*pageSize, pageSize)
	if getUserErr != nil {
		logger.AppLogger.Error(getUserErr.Error())
		return nil, errors.New("500")
	}
	return users, nil
}
