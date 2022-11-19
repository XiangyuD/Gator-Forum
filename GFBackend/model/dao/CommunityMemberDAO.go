package dao

import (
	"GFBackend/entity"
	"GFBackend/model"
	"gorm.io/gorm"
	"sync"
)

var communityMemberDAOLock sync.Mutex
var communityMemberDAO *CommunityMemberDAO

type ICommunityMemberDAO interface {
	Create(communityID int, member, joinDay string) error
	DeleteByCommunityID(id int) error
	DeleteByMember(member string) error
	DeleteByCommunityIDAndMember(communityID int, member string) error
	GetCommunityIDsByMember(member string, pageNO, pageSize int) ([]entity.CommunityMember, error)
	GetMembersByCommunityIDs(id int, pageNO, pageSize int) ([]entity.CommunityMember, error)
	CountMemberByCommunityID(id int) (int64, error)
}

type CommunityMemberDAO struct {
	db *gorm.DB
}

func NewCommunityMemberDAO() *CommunityMemberDAO {
	if communityMemberDAO == nil {
		communityMemberDAOLock.Lock()
		if communityMemberDAO == nil {
			communityMemberDAO = &CommunityMemberDAO{
				db: model.NewDB(),
			}
		}
		communityMemberDAOLock.Unlock()
	}
	return communityMemberDAO
}

func (communityMemberDAO *CommunityMemberDAO) Create(communityID int, member, joinDay string) error {
	result := communityMemberDAO.db.
		Select("CommunityID", "Member", "JoinDay").
		Create(&entity.CommunityMember{
			CommunityID: communityID,
			Member:      member,
			JoinDay:     joinDay,
		})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (communityMemberDAO *CommunityMemberDAO) DeleteByCommunityID(id int) error {
	result := communityMemberDAO.db.Where("CommunityID = ?", id).Delete(&entity.CommunityMember{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (communityMemberDAO *CommunityMemberDAO) DeleteByMember(member string) error {
	result := communityMemberDAO.db.Where("Member = ?", member).Delete(&entity.CommunityMember{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (communityMemberDAO *CommunityMemberDAO) DeleteByCommunityIDAndMember(communityID int, member string) error {
	result := communityMemberDAO.db.Where("CommunityID = ? AND Member = ?", communityID, member).Delete(&entity.CommunityMember{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (communityMemberDAO *CommunityMemberDAO) GetCommunityIDsByMember(member string, pageNO, pageSize int) ([]entity.CommunityMember, error) {
	var communityMembers []entity.CommunityMember
	result := communityMemberDAO.db.
		Select("CommunityID").
		Where("Member = ?", member).
		Offset(pageNO).
		Limit(pageSize).
		Find(&communityMembers)
	if result.Error != nil {
		return nil, result.Error
	}
	return communityMembers, nil
}

func (communityMemberDAO *CommunityMemberDAO) GetMembersByCommunityIDs(id int, pageNO, pageSize int) ([]entity.CommunityMember, error) {
	var communityMembers []entity.CommunityMember
	result := communityMemberDAO.db.
		Select("CommunityID", "Member", "JoinDay").
		Where("CommunityID = ?", id).
		Order("JoinDay DESC").
		Offset(pageNO).
		Limit(pageSize).
		Find(&communityMembers)
	if result.Error != nil {
		return nil, result.Error
	}
	return communityMembers, nil
}

func (communityMemberDAO *CommunityMemberDAO) CountMemberByCommunityID(id int) (int64, error) {
	var count int64
	result := communityMemberDAO.db.Model(&entity.CommunityMember{}).Where("CommunityID = ?", id).Count(&count)
	if result.Error != nil {
		return 0, result.Error
	}
	return count, nil
}
