import { post, get, patch, del } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import { buildQueryString } from "@/lib/query-string";
import type {
  StaffMember,
  InviteStaffInput,
  UpdateStaffInput,
  StaffQueryParams,
} from "@/types/staff";
import type { PaginatedData } from "@/types/api";

export async function getStaffList(params: StaffQueryParams = {}): Promise<PaginatedData<StaffMember>> {
  const query = buildQueryString(params);
  return get<PaginatedData<StaffMember>>(`${API_ENDPOINTS.V1.STAFF}${query}`);
}

export async function getStaffById(id: string): Promise<StaffMember> {
  return get<StaffMember>(`${API_ENDPOINTS.V1.STAFF}/${id}`);
}

export async function inviteStaff(input: InviteStaffInput): Promise<StaffMember> {
  return post<StaffMember>(`${API_ENDPOINTS.V1.STAFF}/invite`, input);
}

export async function acceptInvitation(token: string): Promise<StaffMember> {
  return post<StaffMember>(`${API_ENDPOINTS.V1.STAFF}/accept`, { token });
}

export async function updateStaff(id: string, input: UpdateStaffInput): Promise<StaffMember> {
  return patch<StaffMember>(`${API_ENDPOINTS.V1.STAFF}/${id}`, input);
}

export async function suspendStaff(id: string): Promise<StaffMember> {
  return patch<StaffMember>(`${API_ENDPOINTS.V1.STAFF}/${id}/suspend`);
}

export async function activateStaff(id: string): Promise<StaffMember> {
  return patch<StaffMember>(`${API_ENDPOINTS.V1.STAFF}/${id}/activate`);
}

export async function deleteStaff(id: string): Promise<void> {
  return del<void>(`${API_ENDPOINTS.V1.STAFF}/${id}`);
}
