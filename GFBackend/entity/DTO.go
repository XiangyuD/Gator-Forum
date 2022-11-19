package entity

type ResponseMsg struct {
	NewCommunityID int    `json:"new_community_id"`
	Code           int    `form:"Code" json:"code" example:"200"`
	Message        string `form:"Message" json:"message" example:"process successfully"`
	Nickname       string `form:"Nickname" json:"Nickname" example:"James Bond"`
}

type UserInfo struct {
	Username    string `form:"Username" json:"Username" example:"jamesbond21" `
	Password    string `form:"Password" json:"Password" example:"f9ae5f68ae1e7f7f3fc06053e9b9b539"`
	NewPassword string `form:"NewPassword" json:"NewPassword" example:"3ecb441b741bcd433288f5557e4b9118"`
	ForAdmin    bool   `form:"ForAdmin" json:"ForAdmin" example:true`
}

type SimpleUserInfo struct {
	ID       int    `form:"ID" json:"ID" example:"21" `
	Username string `form:"Username" json:"Username" example:"jamesbond21" `
}

type UsersInfo struct {
	Users    []SimpleUserInfo `form:"Users" json:"Users"`
	PageNO   int              `form:"PageNO" json:"PageNO" example:1`
	PageSize int              `form:"PageSize" json:"PageSize" example:5`
}

type NewUserInfo struct {
	Username   string `form:"Username" json:"Username" example:"jamesbond21"`
	Nickname   string `form:"Nickname" json:"Nickname" example:"Peter Park"`
	Birthday   string `form:"Birthday" json:"Birthday" example:"2022-02-30"`
	Gender     string `form:"Gender" json:"Gender" example:"male/female/unknown"`
	Department string `form:"Department" json:"Department" example:"CS:GO"`
}

type CommunityInfo struct {
	ID          int
	Creator     string `form:"Creator" json:"Creator" example:"test1"`
	Name        string `form:"Name" json:"Name" example:"community1"`
	Description string `form:"Description" json:"Description" example:"this is a test community"`
}

type CommunityNameFuzzyMatch struct {
	Name     string `form:"Name" json:"Name" example:"community1"`
	PageNO   int    `form:"PageNO" json:"PageNO" example:1`
	PageSize int    `form:"PageSize" json:"PageSize" example:5`
}

type CommunitiesInfo struct {
	PageNO      int         `form:"PageNO" json:"PageNO" example:1`
	PageSize    int         `form:"PageSize" json:"PageSize" example:5`
	TotalPageNO int64       `form:"TotalPageNO" json:"TotalPageNO" example:5`
	Communities []Community `form:"Communities" json:"Communities"`
}

type NewCommunityInfo struct {
	PageNO         int         `form:"PageNO" json:"PageNO" example:1`
	PageSize       int         `form:"PageSize" json:"PageSize" example:5`
	Communities    []Community `form:"Communities" json:"Communities"`
	NumberOfMember []int64     `form:"NumberOfMember" json:"NumberOfMember" example:5`
	NumberOfPost   []int64     `form:"NumberOfPost" json:"NumberOfPost" example:5`
}

type CommunityMembersInfo struct {
	CommunityID int               `form:"CommunityID" json:"CommunityID" example:1`
	PageNO      int               `form:"PageNO" json:"PageNO" example:1`
	PageSize    int               `form:"PageSize" json:"PageSize" example:5`
	Members     []CommunityMember `form:"Members" json:"Members"`
}

type CommunityIDsInfo struct {
	Member       string `form:"Member" json:"Member" example:"test1"`
	PageNO       int    `form:"PageNO" json:"PageNO" example:1`
	PageSize     int    `form:"PageSize" json:"PageSize" example:5`
	CommunityIDs []int  `form:"CommunityIDs" json:"CommunityIDs"`
}

type UserNewCapacity struct {
	Username string  `form:"Username" json:"Username" example:"boss"`
	Capacity float64 `form:"Capacity" json:"Capacity" example:16.6`
}

type UserFilename struct {
	Filename string `form:"Filename" json:"Filename" example:"gator.jpg"`
}

type UserFiles struct {
	ResponseMsg
	Filenames []string `form:"Filenames" json:"Filenames" example:"\"xxx.jpg\",\"xxx.png\",\"xxx.gif\""`
}

type UserFollows struct {
	ResponseMsg
	Users []string `form:"Users" json:"Users" example:"\"spriderman\",\"batman\",\"ironman\""`
}

type ArticleTypeInfo struct {
	TypeName    string `form:"TypeName" json:"TypeName" example:"Movie"`
	Description string `form:"Description" json:"Description" example:"Discussion of Movie"`
}

type ArticleOfES struct {
	ID       int    `json:"ID"`
	Username string `json:"Username"`
	Title    string `json:"Title"`
	Content  string `json:"Content"`
}

type ArticlesForSearching struct {
	PageNO      int           `form:"PageNO" json:"PageNO" example:1`
	PageSize    int           `form:"PageSize" json:"PageSize" example:5`
	TotalPageNO int64         `form:"TotalPageNO" json:"TotalPageNO" example:5`
	Articles    []ArticleOfES `form:"Articles" json:"Articles"`
}

type ArticleInfo struct {
	ID          int    `form:"ID" json:"ID" example:12`
	Title       string `form:"Title" json:"Title" example:"Gator Forum"`
	TypeID      int    `form:"TypeID" json:"TypeID" example:11`
	CommunityID int    `form:"CommunityID" json:"CommunityID" example:10`
	Content     string `form:"Content" json:"Content" example:"I love UF"`
}

type ArticleListInfo struct {
	PageNO   int `form:"PageNO" json:"PageNO" example:1`
	PageSize int `form:"PageSize" json:"PageSize" example:5`
}

type ArticleSearchInfo struct {
	PageNO      int    `form:"PageNO" json:"PageNO" example:1`
	PageSize    int    `form:"PageSize" json:"PageSize" example:5`
	SearchWords string `form:"SearchWords" json:"SearchWords" example:"Balala Magic Girl"`
}

type ArticleDetail struct {
	ID            int    `form:"ID" json:"ID" example:12`
	Owner         string `form:"Owner" json:"Owner" example:"Owner1"`
	Title         string `form:"Title" json:"Title" example:"Gator Forum"`
	TypeName      string `form:"TypeName" json:"TypeName" example:"music"`
	CommunityName string `form:"CommunityName" json:"CommunityName" example:"big bang theory"`
	Content       string `form:"Content" json:"Content" example:"I love UF"`
	Liked         bool   `form:"Liked" json:"Liked" example:true`
	Favorited     bool   `form:"Favorited" json:"Favorited" example:true`
	NumLike       int64  `form:"NumLike" json:"NumLike" example:78`
	NumFavorite   int64  `form:"NumFavorite" json:"NumFavorite" example:66`
	NumComment    int64  `form:"NumComment" json:"NumComment" example:99`
	UpdatedAt     string `form:"UpdatedAt" json:"UpdatedAt" example:"2018-01-01"`
}

type ArticleFavoritesInfo struct {
	PageNO           int               `form:"PageNO" json:"PageNO" example:1`
	PageSize         int               `form:"PageSize" json:"PageSize" example:5`
	TotalPageNO      int64             `form:"TotalPageNO" json:"TotalPageNO" example:5`
	ArticleFavorites []ArticleFavorite `form:"ArticleFavorites" json:"ArticleFavorites"`
}

type NewCommentInfo struct {
	ArticleID int    `form:"ArticleID" json:"ArticleID" example:1`
	CommentID int    `form:"CommentID" json:"CommentID" example:1`
	Content   string `form:"Content" json:"Content" example:"It is true"`
}

type ArticleCommentsInfo struct {
	PageNO          int              `form:"PageNO" json:"PageNO" example:1`
	PageSize        int              `form:"PageSize" json:"PageSize" example:5`
	TotalPageNO     int64            `form:"TotalPageNO" json:"TotalPageNO" example:5`
	ArticleComments []ArticleComment `form:"ArticleComments" json:"ArticleComments"`
}
