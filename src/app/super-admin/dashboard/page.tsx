// src/app/super-admin/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SuperAdminDashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-red-600">
                Painel de Super Admin
            </h1>
            <p className="mb-8 text-gray-600">
                Bem-vindo, {session?.user.name}. Acesso total ao sistema.
            </p>

            <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-2 text-red-800">Ações Críticas</h2>
                <ul className="list-disc list-inside text-red-700">
                    <li>Gerir permissões globais</li>
                    <li>Visualizar logs de auditoria</li>
                    <li>Configurações de segurança</li>
                </ul>
            </div>
        </div>
    );
}