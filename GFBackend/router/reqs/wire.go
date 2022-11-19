//go:build wireinject
// +build wireinject

package reqs

import (
	"GFBackend/controller"
	"github.com/google/wire"
)

func InitializeUserManageController() (*controller.UserManageController, error) {
	panic(wire.Build(controller.UserManageControllerSet))
}

func InitializeCommunityManageController() (*controller.CommunityManageController, error) {
	panic(wire.Build(controller.CommunityManageSet))
}

func InitializeFileManageController() (*controller.FileManageController, error) {
	panic(wire.Build(controller.FileManageControllerSet))
}

func InitializeArticleTypeManageController() (*controller.ArticleTypeManageController, error) {
	panic(wire.Build(controller.ArticleTypeManageControllerSet))
}

func InitializeArticleManageController() (*controller.ArticleManageController, error) {
	panic(wire.Build(controller.ArticleManageControllerSet))
}

func InitializeArticleLikeController() (*controller.ArticleLikeController, error) {
	panic(wire.Build(controller.ArticleLikeControllerSet))
}

func InitializeArticleFavoriteController() (*controller.ArticleFavoriteController, error) {
	panic(wire.Build(controller.ArticleFavoriteControllerSet))
}

func InitializeArticleCommentController() (*controller.ArticleCommentController, error) {
	panic(wire.Build(controller.ArticleCommentControllerSet))
}
