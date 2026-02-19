import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const SPRING_BOOT_API = process.env.SPRING_BOOT_API_URL || "http://localhost:8080/api";

/**
 * BFF Route: GET /api/bff/prescriptions
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${SPRING_BOOT_API}/prescriptions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.session?.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch prescriptions" },
        { status: response.status }
      );
    }

    const prescriptions = await response.json();
    return NextResponse.json(prescriptions);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * BFF Route: POST /api/bff/prescriptions
 * Médico prescreve medicamento para paciente
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const response = await fetch(`${SPRING_BOOT_API}/prescriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.session?.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create prescription" },
        { status: response.status }
      );
    }

    const prescription = await response.json();
    return NextResponse.json(prescription, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { springBootClient } from "@/lib/spring-boot-client";

/**
 * BFF Route: GET /api/bff/patients
 * Lista todos os pacientes do usuário autenticado
 */
export async function GET(req: NextRequest) {
  try {
    // Validar sessão
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Chamar Spring Boot
    const patients = await springBootClient("/patients", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.session?.token}`,
      },
    });

    return NextResponse.json(patients);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * BFF Route: POST /api/bff/patients
 * Cria um novo paciente
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const result = await springBootClient("/patients", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${session.session?.token}`,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

