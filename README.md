## BE Project - NC News API

**Hosted Version**

The project is hosted at **[https://thenews-lhhv.onrender.com/api/]**

# Project Overview #

This project is a web API developed for managing various aspects of a content platform. It offers a range of endpoints that allow users to interact with topics, articles, comments, and user data. Key features include the ability to retrieve information about topics, articles, and users, post comments to articles, patch article votes, and delete comments. The project is designed to provide a flexible and functional API for handling content-related operations.


# FEATURES #

**Get All Endpoints**
- Endpoint: `/api`
- Description: Provides a JSON representation of all available endpoints in the API.

**Get All Topics**
- Endpoint: `/api/topics`
- Description: Retrieves an array of all available topics.

**Get All Articles (LIFO)**
- Endpoint: `/api/articles`
- Description: Retrieves all articles using Last In, First Out (LIFO) order.

**Get All Comments (LIFO)**
- Endpoint: `/api/comments`
- Description: Retrieves all comments using LIFO order

**Get Articles by Topic Query**
- Endpoint: `/api/articles`
- Description: Retrieves an array of articles based on specified topic query.

**Get Article by ID**
- Endpoint: `/api/articles/:article_id`
- Description: Retrieves a specific article by its ID.

**Get Comments by Article ID (LIFO)**
- Endpoint: `/api/articles/:article_id/comments`
- Description: Retrieves comments for a specific article using LIFO order.

**Get All Users**
- Endpoint: `/api/users`
- Description: Retrieves information about all users.

**Post Comment to Article**
- Endpoint: `/api/articles/:article_id/comments`
- Description: Posts a new comment to a specific article.

**Patch Article Votes**
- Endpoint: `/api/articles/:article_id`
- Description: Updates the vote count for a specific article.

**Delete Comment**
- Endpoint: `/api/comments/:comment_id`
- Description: Deletes a specific comment.


# SETUP #

**Minimum Versions**
- Node.js: v12.0.0 or higher
- Postgres: v11.0.0 or higher

**Clone the repository:**
- Use the command below which includes the link for this repository:

> git clone https://github.com/semih-suran/theNews.git

Then follow these steps to get the project up and running locally:

1. **Environment Variables**
- In the root directory of your project create the following two files locally to be able to connect the relevant database:

> .env.development
- 
> .env.test

Open both `.env.development` and `.env.test` files and add the necessary environment variables. Below is an example structure with placeholder values:

- For .env.development => `PGDATABASE=your_development_database`

- For .env.test => `PGDATABASE=your_test_database`

2. **Install Dependencies**
- Make sure you have the required dependencies installed. You can install them by running:

> npm init -y
- 
> npm install
- 
> npm install --save pg express dotenv
- 
> npm install --save-dev husky jest jest-extended jest-sorted pg-format supertest

- Then add this on the root level of package.json:

> "jest": {
  "setupFilesAfterEnv": [
    "jest-sorted",
    "jest-extended/all"
  ]
}

3. **Seed Database**

- Use the following command to drop and re-create your databases.

> npm run setup-db

- Then use the following command to seed your databases.

> npm run seed

4. **Run Tests**
- To execute the tests, use the following command:

> npm test

This will run the Jest tests and ensure that your application is functioning as expected.

5. **Start the Development Server**
- To start, use the command below:

> npm start

(default is http://localhost:8080)

This will launch your API locally, and you can access it at the specified port.

**<README Version: #1.2>**

