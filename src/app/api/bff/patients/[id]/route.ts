import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { springBootClient } from "@/lib/spring-boot-client";

const SPRING_BOOT_API = process.env.SPRING_BOOT_API_URL || "http://localhost:8080/api";

/**
 * BFF Route: GET /api/bff/patients/[id]
 * Obtém detalhes de um paciente específico
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const response = await fetch(`${SPRING_BOOT_API}/patients/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.session?.token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: response.status }
      );
    }

    const patient = await response.json();
    return NextResponse.json(patient);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * BFF Route: PUT /api/bff/patients/[id]
 * Atualiza um paciente
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const response = await fetch(`${SPRING_BOOT_API}/patients/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${session.session?.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to update patient" },
        { status: response.status }
      );
    }

    const updated = await response.json();
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * BFF Route: DELETE /api/bff/patients/[id]
 * Deleta um paciente
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const response = await fetch(`${SPRING_BOOT_API}/patients/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.session?.token}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to delete patient" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

