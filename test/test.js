var assert = require('chai').assert;
const cart = require('../models/cart.model');
const product = require('../models/product.model');

describe('Carts Tests', () => {
  beforeEach(() => {
    cart.writeCartsData(mockCartsData);
    product.writeProducts(mockProductData);
  });

  const mockCartsData = {
    selected_cart_id: null,
    carts: [{ id: 1, name: 'My Cart', product_ids: [], products: [], total_price: 0 }]
  };

  const mockProductData = [
    { id: 1, title: 'Toy Car', price: 4, inventory_count: 54 },
    { id: 2, title: 'Soccer Ball', price: 20, inventory_count: 10 }
  ];

  it('should get all carts (no added products)', () => {
    cart.writeCartsData(mockCartsData);
    return cart.getCarts().then(response => {
      assert.deepEqual(response, mockCartsData);
    });
  });

  it('should get by id (1)', () => {
    cart.writeCartsData(mockCartsData);

    return cart.getCartById(1).then(response => {
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

    cart.writeCartsData(mockCartsData);

    cart.createNewCart(cartName);

    return cart.getCarts().then(response => {
      assert.deepEqual(response, {
        selected_cart_id: mockCartsData.selected_cart_id,
        carts: [...mockCartsData.carts, expectedCart]
      });
    });
  });

  it('should set cart 1 to selected', () => {
    const newSelectedCartId = 1;

    cart.writeCartsData(mockCartsData);
    cart.setSelectedCart(newSelectedCartId);

    return cart.getCarts().then(response => {
      assert(response.selected_cart_id == newSelectedCartId);
    });
  });

  it('should add product to selected cart', () => {
    cart.writeCartsData(mockCartsData);
    product.writeProducts(mockProductData);
    cart.setSelectedCart(1);
    cart.addProductToCart(1);

    return cart.getCartById(1).then(response => {
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

    cart.writeCartsData(mockCartsData);
    product.writeProducts(mockProductData);

    cart.setSelectedCart(1);
    cart.addProductToCart(1);
    cart.checkoutCart(1);

    return product.getProductById(1).then(p => {
      assert(p.inventory_count === beforeInventoryCount - 1);
    });
  });
});
