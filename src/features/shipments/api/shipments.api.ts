import { post, get, patch, del } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type {
  Shipment,
  CreateShipmentInput,
  UpdateShipmentInput,
  ShipmentQueryParams,
} from "@/types/shipment";
import type { PaginatedData } from "@/types/api";

export async function getShipmentList(params: ShipmentQueryParams = {}): Promise<PaginatedData<Shipment>> {
  const query = buildQueryString(params);
  return get<PaginatedData<Shipment>>(`${API_ENDPOINTS.V1.SHIPMENTS}${query}`);
}

export async function getShipmentById(id: string): Promise<Shipment> {
  return get<Shipment>(`${API_ENDPOINTS.V1.SHIPMENTS}/${id}`);
}

export async function getShipmentsBySaleId(saleId: string): Promise<Shipment[]> {
  return get<Shipment[]>(`${API_ENDPOINTS.V1.SHIPMENTS}/sale/${saleId}`);
}

export async function createShipment(input: CreateShipmentInput): Promise<Shipment> {
  return post<Shipment>(API_ENDPOINTS.V1.SHIPMENTS, input);
}

export async function updateShipment(id: string, input: UpdateShipmentInput): Promise<Shipment> {
  return patch<Shipment>(`${API_ENDPOINTS.V1.SHIPMENTS}/${id}`, input);
}

export async function deleteShipment(id: string): Promise<void> {
  return del<void>(`${API_ENDPOINTS.V1.SHIPMENTS}/${id}`);
}
