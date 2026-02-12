// src/app/api/medical/stats/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const requestHeaders = await headers();
        const session = await auth.api.getSession({
            headers: requestHeaders
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        // Buscar dados do médico logado
        const doctorProfile = await prisma.doctorProfile.findUnique({
            where: { userId: session.user.id }
        });

        // Data de hoje
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Estatísticas em paralelo para melhor performance
        const [
            todayAppointments,
            waitingPatients,
            doctorsOnDuty,
            totalPatients,
            hospitalized,
            pendingReports,
            lowStock,
            pendingResults,
            pendingPayments,
            emergencyCount
        ] = await Promise.all([
            // Consultas hoje
            prisma.$queryRaw`SELECT COUNT(*) FROM "Consultation" WHERE DATE(date) = CURRENT_DATE`,

            // Pacientes aguardando
            prisma.$queryRaw`SELECT COUNT(*) FROM "Patient" WHERE status = 'aguardando'`,

            // Médicos em plantão
            prisma.$queryRaw`SELECT COUNT(*) FROM "DoctorProfile" WHERE "isOnDuty" = true`,

            // Total de pacientes
            prisma.$queryRaw`SELECT COUNT(*) FROM "Patient"`,

            // Pacientes internados
            prisma.$queryRaw`SELECT COUNT(*) FROM "Patient" WHERE status = 'internado'`,

            // Laudos pendentes
            prisma.$queryRaw`SELECT COUNT(*) FROM "MedicalReport" WHERE status = 'pendente'`,

            // Medicamentos com estoque baixo
            prisma.$queryRaw`SELECT COUNT(*) FROM "Medication" WHERE stock < 10`,

            // Resultados de exames pendentes
            prisma.$queryRaw`SELECT COUNT(*) FROM "ExamResult" WHERE status = 'pendente'`,

            // Pagamentos pendentes
            prisma.$queryRaw`SELECT COUNT(*) FROM "Invoice" WHERE status = 'pendente'`,

            // Emergências
            prisma.$queryRaw`SELECT COUNT(*) FROM "Emergency" WHERE status = 'ativo'`,
        ]);

        const stats = {
            todayAppointments: Number(todayAppointments[0]?.count || 0),
            waitingPatients: Number(waitingPatients[0]?.count || 0),
            doctorsOnDuty: Number(doctorsOnDuty[0]?.count || 0),
            totalPatients: Number(totalPatients[0]?.count || 0),
            hospitalized: Number(hospitalized[0]?.count || 0),
            pendingReports: Number(pendingReports[0]?.count || 0),
            lowStock: Number(lowStock[0]?.count || 0),
            pendingResults: Number(pendingResults[0]?.count || 0),
            pendingPayments: Number(pendingPayments[0]?.count || 0),
            emergency: Number(emergencyCount[0]?.count || 0),

            // Formatação para exibição
            formatted: {
                todayAppointments: `${Number(todayAppointments[0]?.count || 0)} hoje`,
                waitingPatients: `${Number(waitingPatients[0]?.count || 0)} aguardando`,
                doctorsOnDuty: `${Number(doctorsOnDuty[0]?.count || 0)} plantão`,
                lowStock: `${Number(lowStock[0]?.count || 0)} em falta`,
                pendingResults: `${Number(pendingResults[0]?.count || 0)} resultados`,
                emergency: `${Number(emergencyCount[0]?.count || 0)} urgente`,
            }
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}