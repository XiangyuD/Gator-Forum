package controller

import (
	"GFBackend/entity"
	"GFBackend/middleware/auth"
	"GFBackend/service"
	"github.com/gin-gonic/gin"
	"github.com/google/wire"
	"strconv"
	"strings"
	"sync"
)

var communityManageControllerLock sync.Mutex
var communityManageController *CommunityManageController

type CommunityManageController struct {
	communityManageService service.ICommunityManageService
}

func NewCommunityManageController(communityManageService service.ICommunityManageService) *CommunityManageController {
	if communityManageController == nil {
		communityManageControllerLock.Lock()
		if communityManageController == nil {
			communityManageController = &CommunityManageController{
				communityManageService: communityManageService,
			}
		}
		communityManageControllerLock.Unlock()
	}
	return communityManageController
}

var CommunityManageSet = wire.NewSet(
	service.CommunityManageServiceSet,
	wire.Bind(new(service.ICommunityManageService), new(*service.CommunityManageService)),
	NewCommunityManageController,
)

// CreateCommunity godoc
// @Summary Create a new Community
// @Description need token in cookie, need community name & description only
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param CommunityInfo body entity.CommunityInfo true "Create a new community needs Creator, Name & Description."
// @Success 201 {object} entity.ResponseMsg "<b>Success</b>. Create Community Success"
// @Failure 400 {object} entity.ResponseMsg "<b>Failure</b>. Bad Parameters or Community already exists"
// @Failure 500 {object} entity.ResponseMsg "<b>Failure</b>. Server Internal Error."
// @Router /community/create [post]
func (communityManageController *CommunityManageController) CreateCommunity(context *gin.Context) {
	respMsg := entity.ResponseMsg{
		Code:    400,
		Message: "Bad Parameters or Community already exists",
	}

	var communityInfo entity.CommunityInfo
	if err1 := context.ShouldBindJSON(&communityInfo); err1 != nil {
		context.JSON(respMsg.Code, respMsg)
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	newCommunityID, err2 := communityManageController.communityManageService.CreateCommunity(username, communityInfo.Name, communityInfo.Description)
	if err2 != nil {
		if strings.Contains(err2.Error(), "400") {
			context.JSON(respMsg.Code, respMsg)
			return
		}
		respMsg.Code = 500
		respMsg.Message = "Internal Server Error"
		context.JSON(respMsg.Code, respMsg)
		return
	}

	respMsg.Code = 200
	respMsg.Message = "Create Community Success"
	respMsg.NewCommunityID = newCommunityID
	context.JSON(respMsg.Code, respMsg)
	return
}

// DeleteCommunityByID godoc
// @Summary Create a new Community
// @Description need token in cookie, need community id only
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param id query string true "Community ID"
// @Success 200 {object} entity.ResponseMsg "<b>Success</b>. No matter whether delete successfully, Return Success"
// @Router /community/delete/:id [get]
func (communityManageController *CommunityManageController) DeleteCommunityByID(context *gin.Context) {
	respMsg := entity.ResponseMsg{
		Code:    200,
		Message: "Delete Successfully",
	}
	context.JSON(respMsg.Code, respMsg.Message)
	id, err1 := strconv.Atoi(context.Query("id"))
	if err1 != nil {
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)
	err2 := communityManageController.communityManageService.DeleteCommunityByID(id, username)
	if err2 != nil {
		return
	}
}

// UpdateDescriptionByID godoc
// @Summary Update Community Description By ID
// @Description need token in cookie, need community ID & description only, only by creator
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param CommunityInfo body entity.CommunityInfo true "Update Community Description."
// @Success 201 {object} entity.ResponseMsg "<b>Success</b>. Update Success"
// @Failure 400 {object} entity.ResponseMsg "<b>Failure</b>. Bad Parameters or Not Creator or Not Found"
// @Failure 500 {object} entity.ResponseMsg "<b>Failure</b>. Server Internal Error."
// @Router /community/update [post]
func (communityManageController *CommunityManageController) UpdateDescriptionByID(context *gin.Context) {
	respMsg := entity.ResponseMsg{
		Code:    400,
		Message: "Bad Parameters or Not Creator or Not Found",
	}

	var communityInfo entity.CommunityInfo
	if err1 := context.ShouldBindJSON(&communityInfo); err1 != nil {
		context.JSON(respMsg.Code, respMsg)
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	err2 := communityManageController.communityManageService.UpdateDescriptionByID(communityInfo.ID, communityInfo.Description, username)
	if err2 != nil {
		if strings.Contains(err2.Error(), "400") {
			context.JSON(respMsg.Code, respMsg)
			return
		}
		respMsg.Code = 500
		respMsg.Message = "Internal Server Error"
		context.JSON(respMsg.Code, respMsg)
		return
	}

	respMsg.Code = 200
	respMsg.Message = "Create Community Success"
	context.JSON(respMsg.Code, respMsg)
	return
}

// GetNumberOfMemberByID godoc
// @Summary Get the Number Of Member
// @Description need token in cookie, need community ID
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param id query string true "Community ID"
// @Success 200 "<b>Success</b>. Return an Integer"
// @Failure 400 "<b>Failure</b>. Return 0"
// @Failure 500 "<b>Failure</b>. Return 0"
// @Router /community/numberofmember/:id [get]
func (communityManageController *CommunityManageController) GetNumberOfMemberByID(context *gin.Context) {
	id, err1 := strconv.Atoi(context.Query("id"))
	if err1 != nil {
		context.JSON(400, 0)
		return
	}

	number, err2 := communityManageController.communityManageService.GetNumberOfMembersByID(id)
	if err2 != nil {
		context.JSON(400, 0)
		return
	}

	context.JSON(200, number)
}

// GetOneCommunityByID godoc
// @Summary Get One Community By ID
// @Description need token in cookie, need community ID
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param id query string true "Community ID"
// @Success 200 {object} entity.Community "<b>Success</b>. Get Community Success"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /community/getone/:id [get]
func (communityManageController *CommunityManageController) GetOneCommunityByID(context *gin.Context) {
	id, err1 := strconv.Atoi(context.Query("id"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}
	username := context.Query("username")
	pageNO, err3 := strconv.Atoi(context.Query("pageNO"))
	if err3 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}
	pageSize, err4 := strconv.Atoi(context.Query("pageSize"))
	if err4 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	community, count, ifexit, err5 := communityManageController.communityManageService.GetOneCommunityByID(id, username, pageNO, pageSize)
	if err5 != nil {
		context.JSON(500, "Internal Server Error")
		return
	}

	context.JSON(200, gin.H{
		"community": community,
		"count":     count,
		"ifexit":    ifexit,
	})
}

// GetCommunitiesByNameFuzzyMatch godoc
// @Summary Get Communities By Name Fuzzy Match
// @Description need token in cookie, need community Name, page info: PageNO, pageSize
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param name body entity.CommunityNameFuzzyMatch true "Community Name Fuzzy Match Info"
// @Success 200 {object} []entity.Community "<b>Success</b>. Get Community Success"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters or Not Found"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /community/getonebyname [get]
func (communityManageController *CommunityManageController) GetCommunitiesByNameFuzzyMatch(context *gin.Context) {
	var communityNameFuzzyMatch entity.CommunityNameFuzzyMatch
	err1 := context.ShouldBindJSON(&communityNameFuzzyMatch)
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	communities, totalPageNO, err2 := communityManageController.communityManageService.
		GetCommunitiesByNameFuzzyMatch(communityNameFuzzyMatch.Name, communityNameFuzzyMatch.PageNO, communityNameFuzzyMatch.PageSize)
	if err2 != nil {
		return
	}

	communitiesInfo := entity.CommunitiesInfo{
		PageNO:      communityNameFuzzyMatch.PageNO,
		PageSize:    communityNameFuzzyMatch.PageSize,
		TotalPageNO: totalPageNO,
		Communities: communities,
	}
	context.JSON(200, communitiesInfo)
}

// GetCommunities godoc
// @Summary Get Communities By Name Fuzzy Match
// @Description need token in cookie, need page info: PageNO, pageSize only
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param name body entity.CommunityNameFuzzyMatch true "Get Communities Info"
// @Success 200 {object} []entity.Community "<b>Success</b>. Get Community Success"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters or Not Found"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /community/get [get]
func (communityManageController *CommunityManageController) GetCommunities(context *gin.Context) {
	var communityNameFuzzyMatch entity.CommunityNameFuzzyMatch
	err1 := context.ShouldBindJSON(&communityNameFuzzyMatch)
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	communities, totalPageNO, err2 := communityManageController.communityManageService.
		GetCommunities(communityNameFuzzyMatch.PageNO, communityNameFuzzyMatch.PageSize)
	if err2 != nil {
		return
	}

	communitiesInfo := entity.CommunitiesInfo{
		PageNO:      communityNameFuzzyMatch.PageNO,
		PageSize:    communityNameFuzzyMatch.PageSize,
		TotalPageNO: totalPageNO,
		Communities: communities,
	}
	context.JSON(200, communitiesInfo)
}

// GetCommunitiesByCreator godoc
// @Summary Get Communities By Creator
// @Description need token in cookie, need page info: username, PageNO, pageSize
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param name body entity.Community true "Get Communities By Creator"
// @Success 200 {object} []entity.NewCommunityInfo "<b>Success</b>. Get Community Success"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters or Not Found"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /community/getcommunitiesbycreator [get]
func (communityManageController *CommunityManageController) GetCommunitiesByCreator(context *gin.Context) {
	username := context.Query("username")
	pageNO, err1 := strconv.Atoi(context.Query("pageNO"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}
	pageSize, err2 := strconv.Atoi(context.Query("pageSize"))
	if err2 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	communities, count_member, count_post, err3 := communityManageController.communityManageService.
		GetCommunitiesByCreator(username, pageNO, pageSize)
	if err3 != nil {
		return
	}

	communitiesInfo := entity.NewCommunityInfo{
		PageNO:         pageNO,
		PageSize:       pageSize,
		Communities:    communities,
		NumberOfMember: count_member,
		NumberOfPost:   count_post,
	}
	context.JSON(200, communitiesInfo)
}

// JoinCommunityByID godoc
// @Summary Join One Community By ID
// @Description need token in cookie, need community ID
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param id query string true "Community ID"
// @Success 200 {string} string "<b>Success</b>. Join Community Success"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters or Not Found or Existed"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /community/join/:id [get]
func (communityManageController *CommunityManageController) JoinCommunityByID(context *gin.Context) {
	id, err1 := strconv.Atoi(context.Query("id"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters or Not Found or Existed")
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	err2 := communityManageController.communityManageService.JoinCommunityByID(id, username)
	if err2 != nil {
		if strings.Contains(err2.Error(), "400") {
			context.JSON(400, "Bad Parameters or Not Found or Existed")
		} else {
			context.JSON(500, "Server Internal Error")
		}
		return
	}

	context.JSON(200, "Join Successfully")
}

// LeaveCommunityByID godoc
// @Summary Join One Community By ID
// @Description need token in cookie, need community ID
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param id query string true "Community ID"
// @Success 200 {string} string "<b>Success</b>. Leave Community Success"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters"
// @Router /community/leave/:id [get]
func (communityManageController *CommunityManageController) LeaveCommunityByID(context *gin.Context) {
	id, err1 := strconv.Atoi(context.Param("id"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters or Not Found or Existed")
		return
	}

	token, _ := context.Cookie("token")
	username, _ := auth.GetTokenUsername(token)

	_ = communityManageController.communityManageService.LeaveCommunityByID(id, username)
	context.JSON(200, "Leave Successfully")
}

// GetMembersByCommunityIDs godoc
// @Summary Get Members By Community IDs
// @Description need token in cookie, need community IDs
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param id query string true "Community ID"
// @Success 200 {object} []entity.CommunityMember "<b>Success</b>. Get Members Success"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters or Not Found"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /community/getmember [get]
func (communityManageController *CommunityManageController) GetMembersByCommunityIDs(context *gin.Context) {
	//var CommunityMembersInfo entity.CommunityMembersInfo
	//err1 := context.ShouldBindJSON(&CommunityMembersInfo)
	//if err1 != nil {
	//	context.JSON(400, "Bad Parameters")
	//	return
	//}
	CommunityID, err1 := strconv.Atoi(context.Query("id"))
	if err1 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}
	PageNO, err2 := strconv.Atoi(context.Query("pageNO"))
	if err2 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}
	PageSize, err3 := strconv.Atoi(context.Query("pageSize"))
	if err3 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	communityMembers, err4 := communityManageController.communityManageService.
		GetMembersByCommunityIDs(CommunityID, PageNO, PageSize)
	if err4 != nil {
		return
	}
	newCommunityMembersInfo := entity.CommunityMembersInfo{
		PageNO:      PageNO,
		PageSize:    PageSize,
		CommunityID: CommunityID,
		Members:     communityMembers,
	}
	context.JSON(200, newCommunityMembersInfo)
}

//GetCommunityIDsByMember godoc
// @Summary Get Community IDs By Member
// @Description need token in cookie, need member name
// @Tags Community Manage
// @Accept json
// @Produce json
// @Security ApiAuthToken
// @Param name query string true "Member Name"
// @Success 200 {object} []int "<b>Success</b>. Get Community IDs Success"
// @Failure 400 {string} string "<b>Failure</b>. Bad Parameters or Not Found"
// @Failure 500 {string} string "<b>Failure</b>. Server Internal Error."
// @Router /community/getcommunityidbymember [get]
func (communityManageController *CommunityManageController) GetCommunityIDsByMember(context *gin.Context) {
	member := context.Query("name")
	pageNO, err2 := strconv.Atoi(context.Query("pageNO"))
	if err2 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}
	pageSize, err3 := strconv.Atoi(context.Query("pageSize"))
	if err3 != nil {
		context.JSON(400, "Bad Parameters")
		return
	}

	communityIDs, err4 := communityManageController.communityManageService.GetCommunityIDsByMember(member, pageNO, pageSize)
	if err4 != nil {
		return
	}
	context.JSON(200, communityIDs)
}
