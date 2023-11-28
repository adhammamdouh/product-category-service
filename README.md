# Product Category Service
 
# Technologies
  * Nodejs v20.10.0
  * NPM v10.2.3
  * mongodb v7.0
  * Elasticsearch v7.17.13
  * Docker v24.0.5
# Installation and Run
Install docker and docker-compose before starting this installation process.

1. Clone the Repository.
2. Open terminal and cd to the repository folder.
3. Make sure that these ports are available.
* ```Port:9200 (Elasticsearch)```
* ```Port:27017 (mongodb)``` 
* ```Port:3000 (API)```  
5. In terminal execute the following command ```docker compose up -d``` or ```docker-compose up -d``` depending on you docker compose version.

# API Routes
You could check this [postman collection](https://github.com/adhammamdouh/product-category-service/blob/main/Product%20Catalog%20Service.postman_collection.json) just import it into your postman and you are good to go.
## Supplier
#### GET All Suppliers
    GEt /api/suppliers
#### CREATE Supplier
    POST /api/suppliers
#### GET Supplier By Id
    GET /api/suppliers/:id
#### UPDATE Supplier By Id
    PUT /api/suppliers/:id
#### DELETE Supplier By Id
    DELETE /api/suppliers/:id
## Categories
#### GET All Categories
    GEt /api/categories
#### CREATE Categories
    POST /api/categories
#### GET Categories By Id
    GET /api/categories/:id
#### UPDATE Categories By Id
    PUT /api/categories/:id
#### DELETE Categories By Id
    DELETE /api/categories/:id
## Products
#### GET All Products
    GEt /api/products
#### CREATE Products
    POST /api/products
#### FILTER Products
    POST /api/products/filter
#### GET Products By Id
    GET /api/products/:id
#### UPDATE Products By Id
    PUT /api/products/:id
#### DELETE Products By Id
    DELETE /api/products/:id
# System Design Document
You will find the System Design Document [here](https://docs.google.com/document/d/1ppiSvOefHmKLo4gPfJ8wa06SJrMofZ3uGpRM0j_an28/edit?usp=sharing)
