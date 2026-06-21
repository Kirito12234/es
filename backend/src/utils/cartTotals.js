const { toFrontendProduct } = require("./productView");

const calculateCartTotals = (cart) => {
  const items = cart.items.map((item) => {
    const product = item.productId;
    const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    const lineTotal = price * item.quantity;
    const frontendProduct = toFrontendProduct(product);

    return {
      ...frontendProduct,
      productId: product._id,
      name: product.name,
      title: product.name,
      productSlug: frontendProduct.productSlug,
      image: product.images[0] || "",
      price,
      quantity: item.quantity,
      stock: product.stock,
      stockQuantity: product.stock,
      subtotal: lineTotal,
      lineTotal
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

  return {
    items,
    subtotal,
    total: subtotal
  };
};

module.exports = calculateCartTotals;
