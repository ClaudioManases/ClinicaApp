// src/app/admin/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminDashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Painel de Administração
            </h1>
            <p className="mb-8 text-gray-600">
                Bem-vindo, {session?.user.name}. Aqui pode gerir utilizadores, configurações e relatórios.
            </p>

            {/* Adicione aqui componentes de administração */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Utilizadores</h2>
                    <p>Gerir contas de médicos e pacientes.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Relatórios</h2>
                    <p>Visualizar estatísticas da clínica.</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Configurações</h2>
                    <p>Ajustar parâmetros do sistema.</p>
                </div>
            </div>
        </div>
    );
}