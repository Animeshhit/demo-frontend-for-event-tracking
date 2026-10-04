import { getSessionId } from "./session";

type TrackEventInput = {
  eventName: string;
  productId?: string;
  properties?: Record<string, unknown>;
};

export async function trackEvent({
  eventName,
  productId,
  properties = {},
}: TrackEventInput) {
  const sessionId = getSessionId();

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      eventName,
      productId,
      sessionId,
      properties,
      occurredAt: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to track event");
  }

  let data = await response.json();
  console.log("Event tracked successfully:", data);

  return data;
}