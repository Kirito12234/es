const { toFrontendProduct } = require("./productView");

const orderStatusLabels = {
  pending: "Processing",
  paid: "Paid",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

const paymentMethodLabels = {
  COD: "cash",
  Online: "bank"
};

const toFrontendOrder = (order) => {
  const plainOrder = typeof order.toObject === "function" ? order.toObject() : order;

  return {
    ...plainOrder,
    id: plainOrder._id,
    placedAt: plainOrder.createdAt,
    paymentMethod: paymentMethodLabels[plainOrder.paymentMethod] || plainOrder.paymentMethod,
    status: orderStatusLabels[plainOrder.status] || plainOrder.status,
    billingDetails: plainOrder.shippingAddress,
    discount: plainOrder.discount || 0,
    shipping: plainOrder.shipping || 0,
    couponCode: plainOrder.couponCode || null,
    items: (plainOrder.items || []).map((item) => {
      const product = item.productId && typeof item.productId === "object" ? toFrontendProduct(item.productId) : {};
      const subtotal = (item.price || product.price || 0) * (item.quantity || 1);

      return {
        ...product,
        productId: product._id || item.productId,
        sellerId: item.sellerId,
        title: item.name || product.title,
        name: item.name || product.name,
        image: item.image || product.thumbnailUrl || "",
        price: item.price || product.price || 0,
        quantity: item.quantity || 1,
        subtotal,
        lineTotal: subtotal
      };
    })
  };
};

module.exports = { toFrontendOrder };
