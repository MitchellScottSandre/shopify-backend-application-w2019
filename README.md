Sample GET Operation (All):
curl -i -X GET http://localhost:8000/products

Sample GET Operation (By ID):
curl -i -X GET http://localhost:8000/products/1

Sample POST Operation:
curl -i -X POST -H "Content-Type: application/json" -d '{ "title": "Football", "price": 10.00, "inventory_count": 100 }' http://localhost:8000/products
