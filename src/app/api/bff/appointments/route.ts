import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const SPRING_BOOT_API = process.env.SPRING_BOOT_API_URL || "http://localhost:8080/api";

/**
 * BFF Route: GET /api/bff/appointments
 * Lista agendamentos do médico/paciente autenticado
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Passar parâmetros de query (filtros)
    const searchParams = req.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const response = await fetch(
      `${SPRING_BOOT_API}/appointments${queryString ? `?${queryString}` : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.session?.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch appointments" },
        { status: response.status }
      );
    }

    const appointments = await response.json();
    return NextResponse.json(appointments);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * BFF Route: POST /api/bff/appointments
 * Cria um novo agendamento
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const response = await fetch(`${SPRING_BOOT_API}/appointments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.session?.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create appointment" },
        { status: response.status }
      );
    }

    const appointment = await response.json();
    return NextResponse.json(appointment, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

