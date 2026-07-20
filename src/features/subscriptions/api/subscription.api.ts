import { get, post, patch } from "@/core/api-client";
import { API_ENDPOINTS } from "@/api/endpoints";
import type {
  SubscriptionDocument,
  CreateSubscriptionInput,
  UpgradePlanInput,
  SubscriptionUsage,
  BillingRecord,
} from "../types/subscription";

export async function getSubscription(): Promise<SubscriptionDocument | null> {
  return get<SubscriptionDocument | null>(API_ENDPOINTS.V1.SUBSCRIPTIONS);
}

export async function createSubscription(
  input: CreateSubscriptionInput
): Promise<SubscriptionDocument> {
  return post<SubscriptionDocument>(API_ENDPOINTS.V1.SUBSCRIPTIONS, input);
}

export async function upgradePlan(
  input: UpgradePlanInput
): Promise<SubscriptionDocument> {
  return patch<SubscriptionDocument>(
    `${API_ENDPOINTS.V1.SUBSCRIPTIONS}/upgrade`,
    input
  );
}

export async function downgradePlan(
  input: UpgradePlanInput
): Promise<SubscriptionDocument> {
  return patch<SubscriptionDocument>(
    `${API_ENDPOINTS.V1.SUBSCRIPTIONS}/downgrade`,
    input
  );
}

export async function cancelSubscription(): Promise<SubscriptionDocument> {
  return patch<SubscriptionDocument>(
    `${API_ENDPOINTS.V1.SUBSCRIPTIONS}/cancel`
  );
}

export async function renewSubscription(): Promise<SubscriptionDocument> {
  return patch<SubscriptionDocument>(
    `${API_ENDPOINTS.V1.SUBSCRIPTIONS}/renew`
  );
}

export async function getUsage(): Promise<SubscriptionUsage | null> {
  return get<SubscriptionUsage | null>(`${API_ENDPOINTS.V1.SUBSCRIPTIONS}/usage`);
}

export async function getBillingHistory(): Promise<BillingRecord[]> {
  return get<BillingRecord[]>(
    `${API_ENDPOINTS.V1.SUBSCRIPTIONS}/billing`
  );
}
