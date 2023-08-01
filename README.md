
**Technological stack:**
- Frontend: React, HTML/CSS, JSX
- Backend: Golang, GIN,  GORM.
- Database: Mysql, Redis, ElasticSearch..


## API Documentation

- http://167.71.166.120:10010/swagger/index.html

## Wiki Documentation
- https://github.com/fongziyjun16/SE/wiki

## Project Board Link
- https://github.com/fongziyjun16/SE/projects

## Sprint 4 Deliverables
- https://github.com/fongziyjun16/SE/tree/main/Sprint4

## How to run
- https://github.com/fongziyjun16/SE/wiki#how-to-run

## Demo video functionality

https://user-images.githubusercontent.com/90939944/164087559-24c308af-6fe5-425a-a714-28f19fa8d725.mp4

## Cypress test video

https://user-images.githubusercontent.com/90939944/164370699-de224802-e360-4e22-8c77-88d966b087eb.mp4

## Backend test video
https://user-images.githubusercontent.com/89665680/164123715-44a495b6-2f54-42f2-8b7c-42459bd919f9.mp4



# Gator Forum

## Description
Gator-forum is similar to any other forums, like Stack Overflow, Douban, Quora, Reddit… But we hope it is more student-life-related instead of society-related or limited to a specific field. 

In order to gather more students who have interests in common, students could set up interest groups and manage the group. There would be a specific description of the group in order to make people fully clear before they join the group. They can post articles in the group and look up all other articles from different groups which may help them to find more interests.

All articles could be liked, commented and favorited by anyone. It will be a good place to make new friends, whenever someone is interested in the others, they can just follow them to get more information about others. And because of the favorited function, good articles could be saved whenever students want to review them. Besides the search function is also complete, students could search articles or groups just by a few words they want, and the forum will respond to them with the possible answers it owned back to students.

Furthermore, the file system is also complete, each student has its own file system and limited file space for them to upload their avatars as they like. And so do the group model, the group manager could also do that to update the avatar for the group, which will keep the group active. 

A few gator forums have been discovered:
-   [https://insidethegators.com/forums/1](https://insidethegators.com/forums/1)
-   [https://247sports.com/college/florida/Board/Florida-Gators-Message-Board-Forum-14/](https://247sports.com/college/florida/Board/Florida-Gators-Message-Board-Forum-14/)
-   [https://florida.forums.rivals.com/forums/the-locker-room.14/](https://florida.forums.rivals.com/forums/the-locker-room.14/)
-   [https://gatorchatter.com/forums/main-sports-forum.20/](https://gatorchatter.com/forums/main-sports-forum.20/)

But they seem to be all sports-related. Although lots of students have a huge interest in sports, we do not want to only focus on sports. We want to create a place where people can not only discuss about sports, but also lots of things including their courses, their professors, their daily life, their hobbies and so on. They can share whatever they like and legal on Gator-forum.

## Users:

- regular users (UF students/employees)
- admin (Gator Forum Administrator)


## Components and functions:

### Login and Logout
- A user must log in to view the posts, groups, and communicate with other users. In expected scenario, our database should include the UFID and password of all eligible employees and students, so we didn't provide a registration portal. But of course we can't acquire the information we need, so we offer some accounts, including kirby, exia, link, cat and boss, all with password 007. Once logged in, the user should receive a unique token, which will be carried on all request to backend database.
- Before exiting Gator Forum, a user is supposed to log out to clear the cookies, and expire the unique token.

### Group
- A group can be created by a user. The basic information of a group includes: group name, group id, group description. group avatar, create date. Besides basic information, a group also contains a list of members (users who join this group), and a lists of posts submitted by members.
- The basic information of a group can be updated by its creator.
- Users can either join or quit the group. Once joined, this user becomes a member of the group, and can create posts, comment posts, quit group. Once quitted, the user will no longer be able to create posts or comment on others posts until he joins again. But his posts will not be deleted from the group.
- We keep the lists of latest posts and earlies posts and user can choose the sequence they want.

### Post
- A post must and must only belong to a specific group. The attributes of a post contain: post id, post title, post content, create date.
- Once posted, other users could comment this post, like this post, unlike this post if liked before, collect this post and uncollect this post if collected before.
- Each post has three tabs that users can switch while viewing the post: Collection, Comment, Like. Collection tab will return a list of users who collceted this post. Comment will return a list of comments, where each comment includes username, user avatar, content, date. Like tab will return a list of users who liked this post.
	
### User
- A user is defined by the unique username (UFID). The basic information of a user includes: username, avatar, gender, birthday, department, major, email, country, state, city.
- For each user, we maintain the following lists:
	- Following: tht list of users that are followed by this user.
	- Follower: the list of users that are following this user. User can remove following a user.
	- Collection: the list of posts collected by this user. 

### Search
- By input a string, a user can search for groups, users, and posts.

