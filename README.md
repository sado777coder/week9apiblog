Week9 Blog API

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

POST	/api/articles	Create new article

GET	/api/articles	Get all articles

GET	/api/articles/search	Search articles

GET	/api/articles/:id	Get article by ID

PUT	/api/articles/:id	Update article

DELETE	/api/articles/:id	Delete article

Comment Routes (Protected):

METHOD	ENDPOINT	DESCRIPTION :

POST	/api/articles/:id/comments	Add comment

PUT	/api/articles/:id/comments/:commentId	Edit comment

DELETE	/api/articles/:id/comments/:commentId	Delete comment

POST	/api/articles/:id/comments/:commentId/like	Like a comment

Reply Routes (Protected) :

METHOD	ENDPOINT	DESCRIPTION :

POST	/api/articles/:id/comments/:commentId/replies	Add reply to a comment

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
