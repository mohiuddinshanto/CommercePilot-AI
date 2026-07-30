export interface ShipmentStatusHistory {
  status: string;
  timestamp: string;
}

export interface Shipment {
  _id: string;
  storeId: string;
  saleId: string;
  courier: string;
  consignmentId: string;
  status: string;
  codAmount: number;
  codReceived: boolean;
  deliveryAddress: string;
  deliveryPhone: string;
  statusHistory: ShipmentStatusHistory[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface CreateShipmentInput {
  saleId: string;
  courier: string;
  deliveryAddress: string;
  deliveryPhone: string;
  codAmount?: number;
}

export interface UpdateShipmentInput {
  status?: string;
  codReceived?: boolean;
  consignmentId?: string;
  deliveryAddress?: string;
  deliveryPhone?: string;
}

export interface ShipmentQueryParams {
  page?: number;
  limit?: number;
  saleId?: string;
  status?: string;
  courier?: string;
}
