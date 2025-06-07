// frontend/src/apiService.ts
import type { Session } from "@supabase/supabase-js"; // <-- Fix: Use 'import type' for Session

// IMPORTANT: Ensure this matches your FastAPI backend URL
const FASTAPI_BASE_URL = "http://127.0.0.1:8000";

interface SipPlanCreate {
  scheme_name: string;
  monthly_amount: number;
  start_date: string; // YYYY-MM-DD format
}

interface SipPlanResponse {
  id: number;
  scheme_name: string;
  monthly_amount: number;
  start_date: string;
  owner_id: string; // Assuming owner_id is string/UUID
}

interface SipSummary {
  scheme_name: string;
  total_invested: number;
  months_invested: number;
}

// Function to make authenticated API requests
async function callApi<T>(
  endpoint: string,
  method: string,
  session: Session, // Session is used as a type here
  data?: object
): Promise<T> {
  if (!session || !session.access_token) {
    throw new Error("No active session or access token found. Please log in.");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${session.access_token}`,
  };

  const config: RequestInit = {
    method: method,
    headers: headers,
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(`${FASTAPI_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// Specific API functions for SIPs
export const createSip = (session: Session, sipData: SipPlanCreate) =>
  callApi<SipPlanResponse>("/sips/", "POST", session, sipData);

export const getSipSummary = (session: Session) =>
  callApi<SipSummary[]>("/sips/summary", "GET", session);