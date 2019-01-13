var assert = require('chai').assert;
const cart = require('../models/cart.model');
const product = require('../models/product.model');

const mockCartsData = {
  selected_cart_id: null,
  carts: [{ id: 1, name: 'My Cart', product_ids: [], products: [], total_price: 0 }]
};

const mockProductData = [
  { id: 1, title: 'Toy Car', price: 4, inventory_count: 54 },
  { id: 2, title: 'Soccer Ball', price: 20, inventory_count: 10 }
];

describe('Carts Tests', () => {
  beforeEach(() => {
    product.writeProducts(mockProductData);
  });

  it('should get all products', () => {
    product.getProducts().then(response => {
      assert.deepEqual(response, mockProductData);
    });
  });

  it('should get product with id 2', () => {
    product.getProductById(2).then(response => {
      assert.deepEqual(response, mockProductData[1]);
    });
  });

  it('should create a new product', () => {
    const newProductId = mockProductData.length + 1;
    const newProduct = { title: 'Video Game', price: 80.0, inventory_count: 10 };
    product.createProduct(newProduct);

    product.getProductById(newProductId).then(response => {
      assert.deepEqual(response, {
        ...newProduct,
        id: newProductId
      });
    });
  });
});

describe('Carts Tests', () => {
  beforeEach(() => {
    cart.writeCartsData(mockCartsData);
    product.writeProducts(mockProductData);
  });

  it('should get all carts (no added products)', () => {
    cart.getCarts().then(response => {
      assert.deepEqual(response, mockCartsData);
    });
  });

  it('should get by id (1)', () => {
    cart.getCartById(1).then(response => {
      assert.deepEqual(response, mockCartsData.carts[0]);
    });
  });

  it('should create a new cart', () => {
    const cartName = 'My New Cart';
    const expectedCart = {
      id: mockCartsData.carts.length + 1,
      name: cartName,
      product_ids: [],
      products: [],
      total_price: 0
    };

    cart.createNewCart(cartName);

    cart.getCarts().then(response => {
      assert.deepEqual(response, {
        selected_cart_id: mockCartsData.selected_cart_id,
        carts: [...mockCartsData.carts, expectedCart]
      });
    });
  });

  it('should set cart 1 to selected', () => {
    const newSelectedCartId = 1;

    cart.setSelectedCart(newSelectedCartId);

    cart.getCarts().then(response => {
      assert(response.selected_cart_id == newSelectedCartId);
    });
  });

  it('should add product to selected cart', () => {
    cart.setSelectedCart(1);
    cart.addProductToSelectedCart(1);

    cart.getCartById(1).then(response => {
      assert.deepEqual(response, {
        ...mockCartsData.carts[0],
        product_ids: [1],
        products: [mockProductData[0]],
        total_price: mockProductData[0].price
      });
    });
  });

  it('should checkout the selected cart (with products)', () => {
    const beforeInventoryCount = mockProductData[0].inventory_count;

    cart.setSelectedCart(1);
    cart.addProductToSelectedCart(1);
    cart.checkoutCart(1);

    product.getProductById(1).then(p => {
      assert(p.inventory_count === beforeInventoryCount - 1);
    });
  });

  it('should try to get cart by id (bad id)', () => {
    cart
      .getCartById(2)
      .then(response => assert(false, true))
      .catch(err => assert(true, true));
  });

  it('should try to add product to selected cart (no selected cart)', () => {
    cart
      .addProductToSelectedCart(1)
      .then(response => assert(false, true))
      .catch(err => assert(true, true));
  });
});
