package dao

import (
	"GFBackend/entity"
	"GFBackend/model"
	"gorm.io/gorm"
	"sync"
)

var articleCommentDAOLock sync.Mutex
var articleCommentDAO *ArticleCommentDAO

type IArticleCommentDAO interface {
	CreateComment(comment entity.ArticleComment) error
	DeleteCommentByID(id int) error
	DeleteSubCommentByCommentID(commentID int) error
	DeleteCommentByArticleID(articleID int) error
	UpdateCommentByID(id int, newContent string) error
	GetOneCommentByID(id int) (entity.ArticleComment, error)
	GetCommentsByArticleID(articleID, offset, limit int) ([]entity.ArticleComment, error)
	CountCommentsByArticleID(articleID int) (int64, error)
	GetSubCommentsByArticleIDAndCommentID(articleID, commentID, offset, limit int) ([]entity.ArticleComment, error)
	CountSubCommentsByArticleIDAndCommentID(articleID, commentID int) (int64, error)
	CountCommentsOfArticle(articleID int) (int64, error)
}

type ArticleCommentDAO struct {
	db *gorm.DB
}

func NewArticleCommentDAO() *ArticleCommentDAO {
	if articleCommentDAO == nil {
		articleCommentDAOLock.Lock()
		if articleCommentDAO == nil {
			articleCommentDAO = &ArticleCommentDAO{
				db: model.NewDB(),
			}
		}
		articleCommentDAOLock.Unlock()
	}
	return articleCommentDAO
}

func (articleCommentDAO *ArticleCommentDAO) CreateComment(comment entity.ArticleComment) error {
	result := articleCommentDAO.db.Create(&comment)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleCommentDAO *ArticleCommentDAO) DeleteCommentByID(id int) error {
	result := articleCommentDAO.db.Where("ID = ?", id).Delete(&entity.ArticleComment{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleCommentDAO *ArticleCommentDAO) DeleteSubCommentByCommentID(commentID int) error {
	result := articleCommentDAO.db.Where("CommentID = ?", commentID).Delete(&entity.ArticleComment{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleCommentDAO *ArticleCommentDAO) DeleteCommentByArticleID(articleID int) error {
	result := articleCommentDAO.db.Where("ArticleID = ?", articleID).Delete(&entity.ArticleComment{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleCommentDAO *ArticleCommentDAO) UpdateCommentByID(id int, newContent string) error {
	result := articleCommentDAO.db.Where("ID = ?", id).Update("Content", newContent)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (articleCommentDAO *ArticleCommentDAO) GetOneCommentByID(id int) (entity.ArticleComment, error) {
	var comment entity.ArticleComment
	result := articleCommentDAO.db.Where("ID = ?", id).First(&comment)
	if result.Error != nil {
		return entity.ArticleComment{}, result.Error
	}
	return comment, nil
}

func (articleCommentDAO *ArticleCommentDAO) GetCommentsByArticleID(articleID, offset, limit int) ([]entity.ArticleComment, error) {
	var articleComments []entity.ArticleComment
	result := articleCommentDAO.db.Limit(limit).Offset(offset).Where("ArticleID = ? AND CommentID = ?", articleID, 0).Find(&articleComments)
	if result.Error != nil {
		return nil, result.Error
	}
	return articleComments, nil
}

func (articleCommentDAO *ArticleCommentDAO) CountCommentsByArticleID(articleID int) (int64, error) {
	var count int64
	result := articleCommentDAO.db.Model(&entity.ArticleComment{}).Where("ArticleID = ? AND CommentID = ?", articleID, 0).Count(&count)
	if result.Error != nil {
		return 0, result.Error
	}
	return count, nil
}

func (articleCommentDAO *ArticleCommentDAO) GetSubCommentsByArticleIDAndCommentID(articleID, commentID, offset, limit int) ([]entity.ArticleComment, error) {
	var articleComments []entity.ArticleComment
	result := articleCommentDAO.db.Limit(limit).Offset(offset).Where("ArticleID = ? AND CommentID = ?", articleID, commentID).Find(&articleComments)
	if result.Error != nil {
		return nil, result.Error
	}
	return articleComments, nil
}

func (articleCommentDAO *ArticleCommentDAO) CountSubCommentsByArticleIDAndCommentID(articleID, commentID int) (int64, error) {
	var count int64
	result := articleCommentDAO.db.Model(&entity.ArticleComment{}).Where("ArticleID = ? AND CommentID = ?", articleID, commentID).Count(&count)
	if result.Error != nil {
		return 0, result.Error
	}
	return count, nil
}

func (articleCommentDAO *ArticleCommentDAO) CountCommentsOfArticle(articleID int) (int64, error) {
	var count int64
	result := articleCommentDAO.db.Model(&entity.ArticleComment{}).Where("ArticleID = ?", articleID).Count(&count)
	if result.Error != nil {
		return -1, result.Error
	}
	return count, nil
}
