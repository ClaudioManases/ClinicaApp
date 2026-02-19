import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const SPRING_BOOT_API = process.env.SPRING_BOOT_API_URL || "http://localhost:8080/api";

/**
 * BFF Route: POST /api/bff/exams/request
 * Solicita um exame (médico pede ao paciente fazer exame)
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const response = await fetch(`${SPRING_BOOT_API}/exams/request`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.session?.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to request exam" },
        { status: response.status }
      );
    }

    const exam = await response.json();
    return NextResponse.json(exam, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

