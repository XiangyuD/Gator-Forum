package reqs

import "github.com/gin-gonic/gin"

func InitCommunityManageReqs(baseGroup *gin.RouterGroup) *gin.RouterGroup {

	communityManageController, _ := InitializeCommunityManageController()

	communityManageReqsGroup := baseGroup.Group("/community")
	{
		communityManageReqsGroup.POST("/create", communityManageController.CreateCommunity)
		communityManageReqsGroup.GET("/delete", communityManageController.DeleteCommunityByID)
		communityManageReqsGroup.POST("/update", communityManageController.UpdateDescriptionByID)
		communityManageReqsGroup.GET("/numberofmember", communityManageController.GetNumberOfMemberByID)
		communityManageReqsGroup.GET("/getone", communityManageController.GetOneCommunityByID)
		communityManageReqsGroup.POST("/getbyname", communityManageController.GetCommunitiesByNameFuzzyMatch)
		communityManageReqsGroup.GET("/get", communityManageController.GetCommunities)
		communityManageReqsGroup.GET("/join", communityManageController.JoinCommunityByID)
		communityManageReqsGroup.GET("/leave/:id", communityManageController.LeaveCommunityByID)
		communityManageReqsGroup.GET("/getmember", communityManageController.GetMembersByCommunityIDs)
		communityManageReqsGroup.GET("/getcommunityidbymember", communityManageController.GetCommunityIDsByMember)
		communityManageReqsGroup.GET("/getcommunitiesbycreator", communityManageController.GetCommunitiesByCreator)

	}
	return communityManageReqsGroup
}
