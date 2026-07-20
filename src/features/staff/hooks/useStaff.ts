"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStaffList,
  getStaffById,
  inviteStaff,
  acceptInvitation,
  updateStaff,
  suspendStaff,
  activateStaff,
  deleteStaff,
} from "../api/staff.api";
import type {
  StaffQueryParams,
  InviteStaffInput,
  UpdateStaffInput,
} from "@/types/staff";

export function useStaffList(params: StaffQueryParams = {}) {
  return useQuery({
    queryKey: ["staff", params],
    queryFn: () => getStaffList(params),
  });
}

export function useStaff(id: string) {
  return useQuery({
    queryKey: ["staff", id],
    queryFn: () => getStaffById(id),
    enabled: !!id,
  });
}

export function useInviteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InviteStaffInput) => inviteStaff(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => acceptInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStaffInput }) =>
      updateStaff(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useSuspendStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suspendStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useActivateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}
