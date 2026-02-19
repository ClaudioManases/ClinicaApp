"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import UserCard from "@/app/dashboard/_components/user-card";

export default function SuperAdminProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        phone: session?.user?.phone || "",
        departamento: "Tecnologia",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            console.log("Updating super admin profile:", formData);
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
                <h1 className="text-2xl font-bold tracking-tight">Perfil de Super Administrador</h1>
                <p className="text-muted-foreground">
                    Gerencie suas credenciais de acesso global e informações de contato.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <UserCard session={session} activeSessions={session?.session ? [session.session] : []} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Informações de Contato</CardTitle>
                        <CardDescription>
                            Dados para contato em caso de emergências do sistema.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telefone de Emergência</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="departamento">Departamento / Setor</Label>
                            <Input
                                id="departamento"
                                name="departamento"
                                value={formData.departamento}
                                onChange={handleChange}
                                placeholder="Ex: DevOps, Infraestrutura"
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
