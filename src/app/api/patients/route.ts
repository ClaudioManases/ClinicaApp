import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { patientSchema } from "@/lib/validations/patient";
import { z } from "zod";

const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL;

// POST /api/patients - Criar paciente
export async function POST(request: NextRequest) {
    try {
        // 1. Verificar autenticação
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return Response.json({ error: "Não autorizado" }, { status: 401 });
        }

        // 2. Ler e Validar o body da requisição com Zod
        const body = await request.json();
        
        try {
            const validatedData = patientSchema.parse(body);
            
            // 3. Obter o JWT para enviar ao microsserviço
            const jwt = await auth.api.getToken({
                headers: await headers(),
            });

            // 4. Enviar para o microsserviço Spring Boot
            const response = await fetch(`${PATIENT_SERVICE_URL}/api/patients`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${jwt?.token}`, // JWT do BetterAuth
                    "Content-Type": "application/json",
                    "X-User-Id": session.user.id,           // Informações adicionais
                    "X-User-Role": session.user.role || "user",
                    "X-User-Email": session.user.email,
                },
                body: JSON.stringify(validatedData),
            });

            // 5. Tratamento de erros do microsserviço
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Erro do microsserviço:", response.status, errorData);
                
                if (response.status === 400) {
                    return Response.json({ error: "Dados inválidos no serviço", details: errorData }, { status: 400 });
                }
                if (response.status === 401 || response.status === 403) {
                    return Response.json({ error: "Sem permissão no serviço" }, { status: 403 });
                }
                return Response.json({ error: "Erro no serviço de pacientes" }, { status: 502 });
            }

            const data = await response.json();
            return Response.json(data, { status: 201 });

        } catch (validationError) {
            if (validationError instanceof z.ZodError) {
                return Response.json({ 
                    error: "Erro de validação", 
                    details: validationError.errors 
                }, { status: 400 });
            }
            throw validationError;
        }

    } catch (error) {
        console.error("Erro interno ao criar paciente:", error);
        return Response.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}

// GET /api/patients - Listar pacientes
export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session) {
            return Response.json({ error: "Não autorizado" }, { status: 401 });
        }

        const jwt = await auth.api.getToken({
            headers: await headers(),
        });

        // Passar query params para o microsserviço
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        const response = await fetch(
            `${PATIENT_SERVICE_URL}/api/patients?${queryString}`,
            {
                headers: {
                    "Authorization": `Bearer ${jwt?.token}`,
                    "X-User-Id": session.user.id,
                    "X-User-Role": session.user.role || "user",
                },
            }
        );

        if (!response.ok) {
             console.error("Erro ao buscar pacientes:", response.status);
             return Response.json({ error: "Falha ao buscar pacientes" }, { status: response.status });
        }

        const data = await response.json();
        return Response.json(data, { status: 200 });

    } catch (error) {
        console.error("Erro interno ao listar pacientes:", error);
        return Response.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}