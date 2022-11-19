package entity

type User struct {
	ID         int
	Username   string
	Password   string
	Salt       string
	Nickname   string
	Birthday   string
	Gender     string
	Department string
}

func (u User) TableName() string {
	return "User"
}

type Follow struct {
	Followee   string
	Follower   string
	Create_Day string
}

func (follow Follow) TableName() string {
	return "Follow"
}

type Community struct {
	ID          int
	Creator     string
	Name        string
	Description string
	CreateDay   string `gorm:"column:CreateDay"`
}

func (community Community) TableName() string {
	return "Community"
}

type CommunityMember struct {
	CommunityID int `gorm:"column:CommunityID"`
	Member      string
	JoinDay     string `gorm:"column:JoinDay"`
}

func (communityMember CommunityMember) TableName() string {
	return "Community_Member"
}

type Space struct {
	ID       int
	Username string
	Capacity float64
	Used     float64
}

func (space Space) TableName() string {
	return "Space"
}

type ArticleType struct {
	ID          int
	TypeName    string `gorm:"column:TypeName"`
	Description string
	Creator     string
	Create_Day  string
}

func (articleType ArticleType) TableName() string {
	return "Article_Type"
}

type Article struct {
	ID          int
	Username    string
	Title       string
	TypeID      int    `gorm:"column:TypeID"`
	CommunityID int    `gorm:"column:CommunityID"`
	CreateDay   string `gorm:"column:CreateDay"`
	Content     string
}

func (article Article) TableName() string {
	return "Article"
}

type ArticleLike struct {
	ID        int
	Username  string
	ArticleID int    `gorm:"column:ArticleID"`
	LikeDay   string `gorm:"column:LikeDay"`
}

func (articleLike ArticleLike) TableName() string {
	return "Article_Like"
}

type ArticleFavorite struct {
	ID          int
	Username    string
	ArticleID   int    `gorm:"column:ArticleID"`
	FavoriteDay string `gorm:"column:FavoriteDay"`
}

func (articleFavorite ArticleFavorite) TableName() string {
	return "Article_Favorite"
}

type ArticleComment struct {
	ID        int
	Username  string
	ArticleID int    `gorm:"column:ArticleID"`
	CommentID int    `gorm:"column:CommentID"`
	Content   string `gorm:"column:Content"`
	CreateDay string `gorm:"column:CreateDay"`
}

func (articleComment ArticleComment) TableName() string {
	return "Article_Comment"
}
