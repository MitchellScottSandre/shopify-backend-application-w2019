### Installation and Usage

Download the code: `git clone https://github.com/MitchellScottSandre/shopify-backend-application-w2019.git`
Install dependencies: `npm install`
Run: `npm start`

### Sample Operations

Get All Products
`curl -i -X GET http://localhost:8000/products`

Get Product by ID:
`curl -i -X GET http://localhost:8000/products/1`

Purchase a Product by ID:
`curl -i -X POST http://localhost:8000/products/1/purchase`

Create a new Product:
`curl -i -X POST -H "Content-Type: application/json" -d '{ "title": "Football", "price": 10.00, "inventory_count": 100 }' http://localhost:8000/products`

Create a new Cart:
`curl -i -X POST -H "Content-Type: application/json" -d '{ "name": "My Cart" }' http://localhost:8000/carts`
