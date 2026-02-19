"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import UserCard from "@/app/dashboard/_components/user-card";

export default function DoctorProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    // Simulação de dados iniciais (deveria vir do backend)
    const [formData, setFormData] = useState({
        phone: session?.user?.phone || "",
        biografia: "",
        especialidade: "",
        numeroLicenca: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Aqui chamaria a API para atualizar o perfil
            console.log("Updating doctor profile:", formData);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Perfil atualizado com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar perfil.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Meu Perfil Profissional</h1>
                <p className="text-muted-foreground">
                    Gerencie suas informações pessoais e profissionais visíveis para pacientes e clínicas.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Card de Segurança e Conta (UserCard existente) */}
                <div className="space-y-6">
                    <UserCard session={session} activeSessions={session?.session ? [session.session] : []} />
                </div>

                {/* Card de Informações Profissionais */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Médicas</CardTitle>
                        <CardDescription>
                            Dados utilizados para identificação em receitas e agendamentos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telefone Profissional</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="especialidade">Especialidade Principal</Label>
                            <Select
                                onValueChange={(val) => handleSelectChange("especialidade", val)}
                                defaultValue={formData.especialidade}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione sua especialidade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cardiologia">Cardiologia</SelectItem>
                                    <SelectItem value="clinica_geral">Clínica Geral</SelectItem>
                                    <SelectItem value="pediatria">Pediatria</SelectItem>
                                    <SelectItem value="ortopedia">Ortopedia</SelectItem>
                                    <SelectItem value="dermatologia">Dermatologia</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="numeroLicenca">CRM / Número da Licença</Label>
                            <Input
                                id="numeroLicenca"
                                name="numeroLicenca"
                                value={formData.numeroLicenca}
                                onChange={handleChange}
                                placeholder="000000/UF"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="biografia">Biografia Resumida</Label>
                            <Textarea
                                id="biografia"
                                name="biografia"
                                value={formData.biografia}
                                onChange={handleChange}
                                placeholder="Fale um pouco sobre sua experiência e formação..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
