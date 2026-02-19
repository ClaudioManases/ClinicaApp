import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Schemas
const baseSchema = z.object({
  phone: z.string().min(8),
});

const doctorSchema = baseSchema.extend({
  biografia: z.string().optional(),
  especialidade: z.string().min(1),
  numeroLicenca: z.string().min(1),
});

const adminSchema = baseSchema.extend({
  departamento: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Check session
    const session = await auth.api.getSession({ headers: req.headers as any });
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const roleRaw = session.user.role || "user";
    const role = roleRaw === "user" ? "doctor" : roleRaw;

    // Validate based on role
    if (role === "doctor") {
      const parsed = doctorSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ message: parsed.error.errors.map((e) => e.message).join(", ") }, { status: 400 });
      }

      const { phone, biografia, especialidade, numeroLicenca } = parsed.data;

      // Update user
      await prisma.user.update({ where: { id: session.user.id }, data: { phone, profileType: "doctor" } });

      // Upsert doctor profile
      await prisma.doctorProfile.upsert({
        where: { userId: session.user.id },
        update: {
          biografia: biografia || null,
          especialidade: especialidade ? { name: especialidade } as any : null,
          numeroLicenca: numeroLicenca || null,
        },
        create: {
          userId: session.user.id,
          biografia: biografia || null,
          especialidade: especialidade ? { name: especialidade } as any : null,
          numeroLicenca: numeroLicenca || null,
        },
      });

      return NextResponse.json({ ok: true });
    }

    if (role === "admin") {
      const parsed = adminSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ message: parsed.error.errors.map((e) => e.message).join(", ") }, { status: 400 });
      }

      const { phone, departamento } = parsed.data;

      await prisma.user.update({ where: { id: session.user.id }, data: { phone, profileType: "admin" } });

      await prisma.adminProfile.upsert({
        where: { userId: session.user.id },
        update: {
          departamento: departamento || null,
        },
        create: {
          userId: session.user.id,
          departamento: departamento || null,
        },
      });

      return NextResponse.json({ ok: true });
    }

    // superadmin or others
    const parsed = baseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.errors.map((e) => e.message).join(", ") }, { status: 400 });
    }

    const { phone } = parsed.data;
    await prisma.user.update({ where: { id: session.user.id }, data: { phone, profileType: role } });

    if (role === "superadmin") {
      await prisma.superAdminProfile.upsert({
        where: { userId: session.user.id },
        update: { logsAcesso: true },
        create: { userId: session.user.id, nivelAcesso: "total", logsAcesso: true },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("/api/profile/complete error:", error);
    return NextResponse.json({ message: error?.message || "Internal error" }, { status: 500 });
  }
}

