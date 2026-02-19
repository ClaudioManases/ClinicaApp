"use client";

import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import UserCard from "@/app/dashboard/_components/user-card";

export default function AdminProfilePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        phone: session?.user?.phone || "",
        cargo: "Gerente Administrativo",
        departamento: "Administração",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            console.log("Updating admin profile:", formData);
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
                <h1 className="text-2xl font-bold tracking-tight">Perfil Administrativo</h1>
                <p className="text-muted-foreground">
                    Gerencie suas informações de acesso e dados corporativos.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                    <UserCard session={session} activeSessions={session?.session ? [session.session] : []} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Dados Corporativos</CardTitle>
                        <CardDescription>
                            Informações visíveis para a equipe da clínica.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Telefone Corporativo</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="(00) 00000-0000"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="cargo">Cargo / Função</Label>
                            <Input
                                id="cargo"
                                name="cargo"
                                value={formData.cargo}
                                onChange={handleChange}
                                placeholder="Ex: Gerente Financeiro"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="departamento">Departamento</Label>
                            <Input
                                id="departamento"
                                name="departamento"
                                value={formData.departamento}
                                onChange={handleChange}
                                placeholder="Ex: Financeiro, RH"
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
