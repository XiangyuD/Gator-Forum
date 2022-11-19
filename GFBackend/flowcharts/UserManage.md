### Regular User Register

```mermaid
flowchart LR
	Start([Request]) --> UserInfo[/"JSON Object { Username, Password }"/] --> ParamsCheck{ParamsCheck}
	ParamsCheck --> |No| ReturnError[ReturnError] --> End([End])
	ParamsCheck --> |Yes| SearchUser[SearchUser] --> Existed{Existed}
	Existed --> |Yes| ReturnError
	Existed --> |No| InsertUser[InsertUser] --> CreateSpace[Create Space] --> ReturnSuccess[ReturnSuccess] --> End
```

- If there are any server internal errors, it will return 500 to frontend immediately.



### User Login

```mermaid
flowchart LR
	Start([Request]) --> UserInfo[/"JSON Object { Username, Password }"/] --> ParamsCheck{ParamsCheck}
	ParamsCheck --> |No| ReturnError[ReturnError] --> End([End])
	ParamsCheck --> |Yes| SearchUser[SearchUser] --> Existed{Existed}
	Existed --> |No| ReturnError
	Existed --> |Yes| Password{Password Check} --> |No| ReturnError
	Password --> |Yes| TokenGenerate --> CheckinRedis[Checkin Redis] --> ReturnSuccess[ReturnSuccess] --> End
```

### User Logout

```mermaid
flowchart LR
	Start([Request]) --> Params[/"Request Params"/] --> ParamsCheck{ParamsCheck}
	ParamsCheck --> |No| End([End])
	ParamsCheck --> |Yes| TokenCheck{Token Check} --> |Yes| CheckoutRedis[Checkout Redis] --> End
	TokenCheck --> |No| End
```

### Auth

```mermaid
flowchart LR
	Start([Request]) --> PathCheck{Check if Path non auth} --> |Yes| Handler[Handle Request] --> End([End])
	PathCheck --> |No| TokenCheck{Check Token} --> |No| Error[Return Error] --> End
	TokenCheck --> |Yes| RedisCheck{Check Sign in Redis} --> |No| Error
	RedisCheck --> |Yes| RoleCheck{Check Role} --> |No| Error
	RoleCheck --> |Yes| UpdataToken{Update Token} --> |No| Handler
	UpdataToken --> |Yes| NewToken[Generate New Token] --> UpdateRedis[Update Sign In Redis] --> Handler
```



### Admin Register

```mermaid
flowchart LR
	Start([Request]) --> Params[/Request Params/] --> ParamsCheck{ParamsCheck}
	ParamsCheck --> |No| Error[Return Error] --> End([End])
	ParamsCheck --> |Yes| AuthCheck{"Check Auth(token & role)"} --> |No| Error
	AuthCheck --> |Yes| SearchUser[SearchUser] --> Existed{Existed}
	Existed --> |Yes| Error
	Existed --> |No| InsertUser[InsertUser] --> CreateSpace[Create Space] --> Success[ReturnSuccess] --> End
```

### User Delete

```mermaid
flowchart LR
	Start([Request]) --> Params[/Request Params/] --> CheckParams{Params Check} --> |No| Error[Return Error] --> End([End])
	CheckParams --> |Yes| DeleteSelf{Delete Self?} --> |Yes| Error
	DeleteSelf --> |No| IsExisted{Delete User Existed?} --> |No| Error
	IsExisted --> |Yes| DeleteUser[Delete User] --> FreeSpace --> DeleteFollow --> Success[Return Success] --> End
```



### Update User Password

```mermaid
flowchart LR
	Start([Request]) --> Params[/Request Params/] --> ParamsCheck{Check Params} --> |No| Error[Return Error] --> End([End])
	ParamsCheck --> |Yes| MatchOldPassword --> |No| Error
	MatchOldPassword --> |Yes| UpdatePassword --> Success[Return Success] --> End
```



### Update User

```mermaid
flowchart LR
	Start([Request]) --> Params[/Request Params/] --> ParamsCheck{Check Params} --> |No| Error[Return Error] --> End([End])
	ParamsCheck --> |Yes| UpdateUserInfo -->  End
```

### User Follow

```mermaid
flowchart LR
	Start([Reqeust]) --> ReqParams[/Request Params/] --> ParamsCheck{Check Params} --> |No| Error[Return Error] --> End([End])
	ParamsCheck --> |Yes| MainCheck{Check User Exist And HasFollow} --> |No| End
	MainCheck --> |Yes| Insert --> Success[Return Success] --> End
```

### User Unfollow

```mermaid
flowchart LR
	Start([Reqeust]) --> ReqParams[/Request Params/] --> ParamsCheck{Check Params} --> |No| Error[Return Error] --> End([End])
	ParamsCheck --> Delete[] --> Success[Return Success] --> End
```



