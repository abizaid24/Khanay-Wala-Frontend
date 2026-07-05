// Mirrors app.models.user.UserRole on the backend — keep in sync.
export const ROLES = {
  CUSTOMER: "customer",
  RESTAURANT_OWNER: "restaurant_owner",
  ADMIN: "admin",
};

// Mirrors app.schemas.user.RegisterableRole — admin is deliberately
// excluded, admin accounts are granted, never self-registered.
export const REGISTERABLE_ROLES = [
  { value: ROLES.CUSTOMER, label: "Customer", hint: "Order food from restaurants near you" },
  { value: ROLES.RESTAURANT_OWNER, label: "Restaurant Owner", hint: "List your restaurant and manage orders" },
];

// Mirrors app.models.order.OrderStatus
export const ORDER_STATUS = {
  PENDING: "pending",
  PREPARING: "preparing",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.PREPARING]: "Preparing",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "Out for delivery",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
};

// Badge tone per status — used by <Badge tone={ORDER_STATUS_TONE[status]}>
export const ORDER_STATUS_TONE = {
  [ORDER_STATUS.PENDING]: "neutral",
  [ORDER_STATUS.PREPARING]: "saffron",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "saffron",
  [ORDER_STATUS.DELIVERED]: "cardamom",
  [ORDER_STATUS.CANCELLED]: "paprika",
};

// Ordered sequence for a simple progress tracker (cancelled is a branch, not a step).
export const ORDER_STATUS_SEQUENCE = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
];
