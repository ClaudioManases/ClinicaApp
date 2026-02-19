// src/app/doctor/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import PatientList from "@/components/patient-list";

export default async function DoctorDashboard() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Bem-vindo, Dr(a). {session?.user.name}
            </h1>
            <p className="mb-8 text-gray-600">
                Este é o seu painel de controlo. Aqui pode gerir os seus pacientes e consultas.
            </p>

            {/* Componente de Lista de Pacientes */}
            <PatientList />
        </div>
    );
}