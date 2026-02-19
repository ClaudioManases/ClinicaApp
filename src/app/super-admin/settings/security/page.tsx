"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ShieldCheck, Lock, Key, UserCheck } from "lucide-react";

export default function SecuritySettingsPage() {
    const [loading, setLoading] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [passwordPolicy, setPasswordPolicy] = useState({
        minLength: 8,
        requireSpecialChar: true,
        requireNumber: true,
        requireUppercase: true
    });

    const handleSaveSettings = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Configurações de segurança atualizadas!");
        } catch (error) {
            toast.error("Erro ao salvar configurações.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Segurança e Acessos</h1>
                <p className="text-muted-foreground">
                    Configure as políticas de segurança da clínica e controle de acesso.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Autenticação de Dois Fatores */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            Autenticação de Dois Fatores (2FA)
                        </CardTitle>
                        <CardDescription>
                            Adicione uma camada extra de segurança para todos os usuários da clínica.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="2fa-toggle" className="flex flex-col space-y-1">
                                <span>Exigir 2FA para todos os funcionários</span>
                                <span className="font-normal text-xs text-muted-foreground">
                                    Recomendado para proteger dados sensíveis de pacientes.
                                </span>
                            </Label>
                            <Switch
                                id="2fa-toggle"
                                checked={twoFactorEnabled}
                                onCheckedChange={setTwoFactorEnabled}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Política de Senhas */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-primary" />
                            Política de Senhas
                        </CardTitle>
                        <CardDescription>
                            Defina os requisitos mínimos para senhas de usuários.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="min-length">Comprimento Mínimo</Label>
                            <Input
                                id="min-length"
                                type="number"
                                value={passwordPolicy.minLength}
                                onChange={(e) => setPasswordPolicy({ ...passwordPolicy, minLength: parseInt(e.target.value) })}
                                min={6}
                                max={20}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="special-char">Exigir Caractere Especial</Label>
                            <Switch
                                id="special-char"
                                checked={passwordPolicy.requireSpecialChar}
                                onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireSpecialChar: checked })}
                            />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                            <Label htmlFor="number-req">Exigir Números</Label>
                            <Switch
                                id="number-req"
                                checked={passwordPolicy.requireNumber}
                                onCheckedChange={(checked) => setPasswordPolicy({ ...passwordPolicy, requireNumber: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Controle de Sessão */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserCheck className="h-5 w-5 text-primary" />
                            Controle de Sessão
                        </CardTitle>
                        <CardDescription>
                            Gerencie o tempo de inatividade permitido.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
                            <Input
                                id="session-timeout"
                                type="number"
                                defaultValue={30}
                                min={5}
                                max={120}
                            />
                            <p className="text-xs text-muted-foreground">
                                O usuário será desconectado automaticamente após este período de inatividade.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Chaves de API */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary" />
                            Integrações e API
                        </CardTitle>
                        <CardDescription>
                            Gerencie chaves de acesso para sistemas externos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-muted rounded-md text-sm text-muted-foreground text-center">
                            Nenhuma chave de API ativa no momento.
                        </div>
                        <Button variant="outline" className="w-full">
                            Gerar Nova Chave de API
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button size="lg" onClick={handleSaveSettings} disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Todas as Configurações"}
                </Button>
            </div>
        </div>
    );
}
