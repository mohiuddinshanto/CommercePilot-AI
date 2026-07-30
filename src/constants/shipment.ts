export const SHIPMENT_STATUS = {
  PENDING: "pending",
  PICKED: "picked",
  IN_TRANSIT: "in_transit",
  DELIVERED: "delivered",
  RETURNED: "returned",
  CANCELLED: "cancelled",
} as const;

export const COURIER_NAMES = {
  STEADFAST: "steadfast",
  PATHAO: "pathao",
  REDX: "redx",
  ECOURIER: "ecourier",
  MANUAL: "manual",
} as const;
