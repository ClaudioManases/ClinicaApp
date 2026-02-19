import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export interface Patient {
    id: string;
    name: string;
    email: string;
    phone?: string;
    birthDate: string;
    gender: "male" | "female" | "other";
    address?: string;
}

export function usePatients() {
    const { data: session, status } = useSession();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = async () => {
        if (status !== "authenticated") return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/patients");
            
            if (!response.ok) {
                throw new Error("Falha ao buscar pacientes");
            }

            const data = await response.json();
            setPatients(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro desconhecido");
            toast.error("Não foi possível carregar a lista de pacientes");
        } finally {
            setLoading(false);
        }
    };

    const createPatient = async (patientData: Omit<Patient, "id">) => {
        if (status !== "authenticated") {
            toast.error("Você precisa estar logado para criar um paciente");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/patients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(patientData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Falha ao criar paciente");
            }

            const newPatient = await response.json();
            setPatients((prev) => [...prev, newPatient]);
            toast.success("Paciente criado com sucesso!");
            return newPatient;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erro ao criar paciente";
            toast.error(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchPatients();
        }
    }, [status]);

    return {
        patients,
        loading,
        error,
        createPatient,
        refetch: fetchPatients,
        isAuthenticated: status === "authenticated",
        userRole: session?.user?.role,
    };
}