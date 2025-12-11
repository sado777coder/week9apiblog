URL = https://week9apiblog.onrender.com

URLWeek9 Blog API

A full-featured blog API built with Node.js, Express, and MongoDB.
This API supports user authentication, article management, search, comments, reply threads, and likes on comments.

Features:

 User Features:
 
User registration

User login

JWT-based authentication

Protected routes :

Article Features :

Create articles

Read all articles

Read a single article

Update articles (only by author)

Delete articles (only by author)

Search articles by keywords

Comment & Reply Features :

Add comments to an article

Edit comments

Delete comments

Like comments

Reply to comments (nested replies)

Technologies Used :

Node.js

Express.js

MongoDB / Mongoose

JSON Web Token (JWT)

Joi Validation

Custom Middlewares

CORS

Authentication Routes (Public):

POST /api/user/sign-up

Create a new user account

POST /api/user/login

Login and receive a JWT token.

Article Routes (Protected):

METHOD	ENDPOINT	DESCRIPTION:

Create new article

POST	/api/articles	

Get all articles

GET	/api/articles	

Search articles

GET	/api/articles/search	

Get article by ID

GET	/api/articles/:id	

Update article

PUT	/api/articles/:id	

Delete article

DELETE	/api/articles/:id	

Comment Routes (Protected):

METHOD	ENDPOINT	DESCRIPTION :

Add comment

POST	/api/articles/:id/comments	

Edit comment

PUT	/api/articles/:id/comments/:commentId	

Delete comment

DELETE	/api/articles/:id/comments/:commentId	

Like a comment

POST	/api/articles/:id/comments/:commentId/like	

Reply Routes (Protected) :

METHOD	ENDPOINT	DESCRIPTION :

Add reply to a comment

POST	/api/articles/:id/comments/:commentId/replies	

Error Handling

The API includes a global error handler that catches:
Invalid routes

Validation errors

Authentication errors

Database issues

Contributing

Pull requests and suggestions are welcome.

 License
This project is open-source and free to use.
