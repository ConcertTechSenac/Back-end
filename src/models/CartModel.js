class CartModel {
  constructor(
    id = null,
    userId = null,
    items = [],
    total = 0,
    createdAt = null,
    updatedAt = null,
  ) {
    this.id = id;
    this.userId = userId;
    this.items = items;
    this.total = total;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = CartModel;
