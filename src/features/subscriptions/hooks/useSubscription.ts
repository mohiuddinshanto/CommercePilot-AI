"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSubscription,
  createSubscription,
  upgradePlan,
  downgradePlan,
  cancelSubscription,
  renewSubscription,
  getUsage,
  getBillingHistory,
} from "../api/subscription.api";
import type {
  CreateSubscriptionInput,
  UpgradePlanInput,
} from "../types/subscription";

const SUBSCRIPTION_KEY = ["subscription"];
const USAGE_KEY = ["subscription", "usage"];
const BILLING_KEY = ["subscription", "billing"];

export function useSubscription() {
  return useQuery({
    queryKey: SUBSCRIPTION_KEY,
    queryFn: getSubscription,
  });
}

export function useSubscriptionUsage() {
  return useQuery({
    queryKey: USAGE_KEY,
    queryFn: getUsage,
  });
}

export function useBillingHistory() {
  return useQuery({
    queryKey: BILLING_KEY,
    queryFn: getBillingHistory,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateSubscriptionInput) => createSubscription(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEY });
      queryClient.invalidateQueries({ queryKey: USAGE_KEY });
    },
  });
}

export function useUpgradePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpgradePlanInput) => upgradePlan(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEY });
      queryClient.invalidateQueries({ queryKey: USAGE_KEY });
    },
  });
}

export function useDowngradePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpgradePlanInput) => downgradePlan(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEY });
      queryClient.invalidateQueries({ queryKey: USAGE_KEY });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEY });
    },
  });
}

export function useRenewSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => renewSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEY });
      queryClient.invalidateQueries({ queryKey: USAGE_KEY });
    },
  });
}
