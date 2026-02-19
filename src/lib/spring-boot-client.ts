/**
 * Cliente HTTP para comunicação com serviços Spring Boot
 * Este arquivo encapsula toda a lógica de requisições ao backend Java
 */

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const SPRING_BOOT_BASE_URL = process.env.SPRING_BOOT_API_URL || "http://localhost:8080/api";

export interface SpringBootRequestInit extends RequestInit {
  skipAuth?: boolean;
}

/**
 * Cliente HTTP para Spring Boot com autenticação automática
 * Injeta o token Better Auth no header Authorization
 */
export async function springBootClient<T = any>(
  endpoint: string,
  options: SpringBootRequestInit = {}
): Promise<T> {
  const { skipAuth = false, ...fetchOptions } = options;

  // Obter o token da sessão Better Auth
  let authToken: string | null = null;

  if (!skipAuth) {
    try {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (session?.session?.token) {
        authToken = session.session.token;
      }
    } catch (error) {
      console.error("Failed to get session:", error);
    }
  }

  // Construir headers com autenticação
  const headersInit = new Headers(fetchOptions.headers);

  if (authToken) {
    headersInit.set("Authorization", `Bearer ${authToken}`);
  }

  headersInit.set("Content-Type", "application/json");
  headersInit.set("X-Requested-With", "XMLHttpRequest");

  // Fazer requisição para Spring Boot
  const url = `${SPRING_BOOT_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...fetchOptions,
    headers: headersInit,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData?.message || `Spring Boot API error: ${response.status}`
    );
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }

  // Parse response
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text() as any;
}

/**
 * Requisições específicas para Spring Boot
 */
export const springBootAPI = {
  // ===== PACIENTES =====
  patients: {
    list: (params?: { page?: number; size?: number }) =>
      springBootClient("/patients", { method: "GET" }),

    get: (id: string) =>
      springBootClient(`/patients/${id}`, { method: "GET" }),

    create: (data: any) =>
      springBootClient("/patients", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      springBootClient(`/patients/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      springBootClient(`/patients/${id}`, { method: "DELETE" }),
  },

  // ===== AGENDAMENTOS =====
  appointments: {
    list: (params?: { doctorId?: string; patientId?: string }) =>
      springBootClient("/appointments", { method: "GET" }),

    get: (id: string) =>
      springBootClient(`/appointments/${id}`, { method: "GET" }),

    create: (data: any) =>
      springBootClient("/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      springBootClient(`/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      springBootClient(`/appointments/${id}`, { method: "DELETE" }),
  },

  // ===== MÉDICOS =====
  doctors: {
    list: () =>
      springBootClient("/doctors", { method: "GET" }),

    get: (id: string) =>
      springBootClient(`/doctors/${id}`, { method: "GET" }),

    create: (data: any) =>
      springBootClient("/doctors", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      springBootClient(`/doctors/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // ===== EXAMES =====
  exams: {
    list: () =>
      springBootClient("/exams", { method: "GET" }),

    get: (id: string) =>
      springBootClient(`/exams/${id}`, { method: "GET" }),

    create: (data: any) =>
      springBootClient("/exams", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    request: (data: any) =>
      springBootClient("/exams/request", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // ===== RECEITAS =====
  prescriptions: {
    list: () =>
      springBootClient("/prescriptions", { method: "GET" }),

    create: (data: any) =>
      springBootClient("/prescriptions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },
};

