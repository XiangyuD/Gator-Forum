# 1 Frontend
In this section, we will display webpages and functions that have been built using mock data. Note that some functions have already been integrated while other have not. Integrated function will be marked by a symbol (+).

## 1.1 Login (+)
When a user opens our project, he will first be directed to login page. He will need to input a username and password to get access to the forum. This function has been tested with backend.

If the username and password matches our backend database, he will receive a message called "Login successfully!"  and be redirected to homepage. Frontend will receive three pieces of information from backend, which are: "code",  "username", "message". Code 2xx indicates the interaction between frontend and backend is successful, code 4xx indicates bad parameters or bad request. and code 5xx indicates server fail. Username will be saved into a global variable for later convenience. Message is a token which will be set in cookies, and all requests to backend must carry this message. 

If the username and password do not match our record or other errors occur during the process, a message written "Login failed!" will display and the user will have to reenter username and password to try again. 

## 1.2 Logout (+)
On the right up corner, by putting the mouse on username, a few menus will appear and the last menu is logout. By clicking this 'Log Out' menu, a user will be logged out of our forum and redirected to 'Login' page. 

## 1.3 Homepage (+)
This page will display posts according to specific preference. Right now, we just display some random posts in this page. A post includes "post id", "title", "content", "owner", "createdAt", "group", "number of likes", "number of replies", "number of collections". User can click "title" to enter the post page, or click "owner" to the personal page of that user, or click "group" to the group page of that group.

## 1.4 Search
On the right up corner of each webpage, we have a search button which looks like a magnifier. By clicking this button,  a search bar will appear and user can use it to search related posts. User can input key words and hit "enter". In ideal situation, this action will send the key words to backend and receive the search results.

## 1.5 Account
In this subsection, we will display user account information. A user account includes personal center, settings, created groups and joined groups. 
### 1.5.1 Personal Center
#### 1.5.1.1 Basic information (+)
Basic information of a user includes "username", "birthday", "avatar", "email", "signature", "major", "country", "province/county", "city", "grade", "phone", "interests" and "courses".
#### 1.5.1.2 Follower
This tab shows all followers of a user. This user can remove followers. 
#### 1.5.1.3 Following
This tab shows all users that this user is following. This user can remove followings. 
#### 1.5.1.4 Blacklist
This tab shows all users in the blacklist. The user can move out a user from blacklist.
#### 1.5.1.5 Collection
This tab shows posts that are favourited by the user. The user can cancel collection.
### 1.5.2 Settings
This page includes password and email settings. User can change password or email at this page.
### 1.5.3 Created Groups Management
#### 1.5.3.1 Analysis (Pending)
This tab is pending because we haven't decided yet what data we should collect and display here.
#### 1.5.3.2 Basic information
This page displays basic information of a group, including "owner", "name", "description", "avatar", "createdAt", "number of group members".
#### 1.5.3.3 Group members
This tab shows all users who have joined this group. Group owner can remove a member.
#### 1.5.3.4 Posts
This tab shows all posts in this group. Group owner can delete a post.
#### 1.5.3.5 Notifications (Pending)
We are still discussing what should be put on this page.
### 1.5.4 Create New Groups
By click this tab, a user can create a new group by entering basic information and hit "Submit".
### 1.5.5 Joined Groups
This page displays all groups this user joined. User can click a group and enter the group page.

## 1.6 Group 
### 1.6.1 Group Basic Information (+)
This part displays some of group information that should be available to all users, including "name", "owner", "createdAt", "avatar", "description" and "number of group members". Normal users will not be able to see members of this group. They will also not be able to delete a post or member.
### 1.6.2 Latest Posts (+)
This tab shows posts in the order of created time.
### 1.6.3 Hottest Posts
This tab shows posts in the order of popular.
## 1.7 Post
### 1.7.1 Post Basic Information (+)
A post includes "post id", "title", "content", "owner", "createdAt", "group", "number of likes", "number of replies", "number of collections". 
### 1.7.2 Collection (+)
This tab shows list of users who have favourited this post.
### 1.7.3 Like (+)
This tab shows list of users who have liked this post. 
### 1.7.4 Reply (+)
This tab shows all replies of this post. Each reply has a "createdAt", "content", "owner", "number of likes". 


# 2 Backend

## 2.1 User Management

- User login
- User logout
- User update password
- User can view and update personal information
- User follow other users
- User unfollow other users
- User can view the subscribed list
- User can view all the groups which are involved

## 2.2 Article Management

- User can view all articles in the home page
- User in one group homepage can view all articles belongs to this group
- User can search article by words
- User can view one article's detail
- User can post an article
- User can update article's title or content after posting the article
- User can like  and unlike an article
- User can favorite and unfavorite an article
- User can post comment for an article
- User can comment for a comment

## 2.3 Group Management

- User can create a group
- User can update group information
- User can search a group by group name
- User can join a group
- User can leave a group
- Creator can view the members in this group

## 2.4 File Management

- User can upload private files.
- User can request and browse private files.
- User can delete their private files.
- User download their private files.
- User can see their space capacity.
- Admin can expand users space capacity

## 3 Unit Test

GFBackend/test

## 4 Cypress Test

GFfrontend/cypress
