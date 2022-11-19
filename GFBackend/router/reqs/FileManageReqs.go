package reqs

import "github.com/gin-gonic/gin"

func InitFileManageReqs(baseGroup *gin.RouterGroup) *gin.RouterGroup {

	fileManageController, _ := InitializeFileManageController()

	fileManageReqsGroup := baseGroup.Group("/file")
	{
		fileManageReqsGroup.POST("/upload", fileManageController.UploadFile)
		fileManageReqsGroup.POST("/upload/communityavatar/:groupid", fileManageController.UploadCommunityAvatar)
		fileManageReqsGroup.POST("/download", fileManageController.DownloadFile)
		fileManageReqsGroup.POST("/delete", fileManageController.UserDeleteFile)
		fileManageReqsGroup.POST("/scan", fileManageController.ScanFiles)

		spaceReqsGroup := fileManageReqsGroup.Group("/space")
		{
			spaceReqsGroup.POST("/info", fileManageController.UserSpaceInfo)
			spaceReqsGroup.POST("/update", fileManageController.UpdateUserCapacity)
		}
	}

	return nil
}
