### Installation and Usage

Download the code: `git clone https://github.com/MitchellScottSandre/shopify-backend-application-w2019.git`

Install dependencies: `npm install`

Run: `npm start`

Run Tests: `npm test`

Notes:

- Need to create a cart, select that cart, and add products to that cart to checkout those products

### Technologies Used

- Node JS
- Express JS
- Mocha JS
- Chai JS

### Sample Operations

Get All Products
`curl -i -X GET http://localhost:8000/products`

Get Product by ID:
`curl -i -X GET http://localhost:8000/products/1`

Create a new Product:
`curl -i -X POST -H "Content-Type: application/json" -d '{ "title": "Video Game", "price": 80.00, "inventory_count": 55 }' http://localhost:8000/products`

Get All Carts:
`curl -i -X GET http://localhost:8000/carts`

Get Cart by ID:
`curl -i -X GET http://localhost:8000/carts/1`

Create a new Cart:
`curl -i -X POST -H "Content-Type: application/json" -d '{ "name": "My Cart" }' http://localhost:8000/carts`

Set Selected Cart by ID:
`curl -i -X POST http://localhost:8000/carts/1/select`

Add Product to Current Selected Cart:
`curl -i -X POST http://localhost:8000/products/1/addToCart`

Checkout Cart:
`curl -i -X POST http://localhost:8000/carts/1/checkout`
