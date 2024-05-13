# Blogging Platform Backend

This project is a backend system for a blogging platform built using Express.js and MongoDB. It provides RESTful API endpoints for user authentication, blog post management, user interactions, search functionality, and admin operations.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Folder Structure](#folder-structure)
4. [API Documentation](#api-documentation)
5. [Testing](#testing)
6. [Report](#report)

## Installation

To install and run this project locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Run `npm install` to install all dependencies.
4. Set up your MongoDB database and configure the connection in `.env` file.
5. Run `npm start` to start the server.

## Usage

Once the server is running, you can use any API testing tool like Postman to interact with the endpoints. Refer to the API documentation for details on available endpoints and their usage.

## Folder Structure

- **controllers/**: Contains controller files for different modules.
  - `admin.js`: Admin operations controller.
  - `authentication.js`: User authentication controller.
  - `postmanagement.js`: Blog post management controller.
  - `search.js`: Search functionality controller.
  - `userinteraction.js`: User interaction controller.
- **models/**: Contains model files for user and blog.
  - `userModel.js`: User model.
  - `blogModel.js`: Blog model.
  - `index.js`: Index file to connect to the database.
- **middlewares/**: Contains middleware functions.
- **routes/**: Contains route files for different modules.
- **tests/**: Contains test scripts.
- **utils/**: Contains utility functions.
- **.env**: Environment variables configuration file.
- **app.js**: Entry point of the application.
- **package.json**: Project configuration file.

## Testing

The project includes a comprehensive Postman collection for testing the API endpoints. Refer to the Postman collection https://www.postman.com/spaceflight-geoscientist-52200218/workspace/blogging-site-bakcend-routes to execute test cases.



