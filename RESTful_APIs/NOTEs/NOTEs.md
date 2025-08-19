# RESTful and API

![RESTful APIs](image-1.png)

## Express server initial setup

![express setup](image-2.png)

Controllers:

- are the functions that allow us to get information into the endpoints and forward it to whoever is calling it.

Routes:

- are basically the endpoints

Models:

- are the schema models for out database

## Folder Structure

![Folder structure](image.png)

`crmRoutes.js`
![routes](image-3.png)

## Middlewares

- are simply functions that have access to the request and response object
- In express application It can run code there
- It can make changes to the request response objects

## Mongo DB setup

- create new DB with cluster or localhost:27017
- connect with mongoose and body-parser

![mongoose setup](image-4.png)

## Mongo DB schema

- dictates the types of data and the structure of your data for the DB

![mongo DB model - Schema](image-5.png)

## Controller

- send the data to the database
- update the data to the database

`const Contact = mongoose.model("Contact", ContactSchema);`
