"use client";

import { usePatients, Patient } from "@/hooks/use-patients";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema, PatientInput } from "@/lib/validations/patient";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function PatientForm({ onSubmit, isLoading }: { onSubmit: (data: PatientInput) => void, isLoading: boolean }) {
    const form = useForm<PatientInput>({
        resolver: zodResolver(patientSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            birthDate: "",
            gender: undefined,
            address: "",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data de Nascimento</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Género</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o género" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="male">Masculino</SelectItem>
                                    <SelectItem value="female">Feminino</SelectItem>
                                    <SelectItem value="other">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Criar Paciente"}
                </Button>
            </form>
        </Form>
    );
}


export default function PatientList() {
    const { patients, loading, error, createPatient, isAuthenticated, userRole } = usePatients();

    if (!isAuthenticated) {
        return <p>Você precisa estar autenticado para ver esta página.</p>;
    }

    const handleCreatePatient = async (data: PatientInput) => {
        try {
            await createPatient(data);
        } catch (e) {
            // O erro já é tratado no hook
        }
    };

    return (
        <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Pacientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading && <Loader2 className="animate-spin" />}
                        {error && <p className="text-red-500">{error}</p>}
                        {!loading && !error && (
                            <ul>
                                {patients.map((p: Patient) => (
                                    <li key={p.id} className="border-b p-2">
                                        {p.name} ({p.email})
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Adicionar Novo Paciente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PatientForm onSubmit={handleCreatePatient} isLoading={loading} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
