"use client";

import { useOrganizationDetailQuery } from "@/data/organization/organization-detail-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Calendar } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function DoctorOrganizationPage() {
    const { data: organization, isLoading } = useOrganizationDetailQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    if (!organization) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-[50vh] text-center space-y-4">
                <Building2 className="h-16 w-16 text-muted-foreground/50" />
                <h2 className="text-xl font-semibold">Nenhuma Organização</h2>
                <p className="text-muted-foreground max-w-md">
                    Você ainda não faz parte de nenhuma organização médica. 
                    Aguarde um convite de um administrador.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Minha Organização</h1>
                <p className="text-muted-foreground">
                    Detalhes da clínica ou hospital onde você atua.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Informações Gerais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={organization.logo || undefined} />
                                <AvatarFallback>{organization.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="text-lg font-semibold">{organization.name}</h3>
                                <p className="text-sm text-muted-foreground">@{organization.slug}</p>
                            </div>
                        </div>
                        
                        <div className="grid gap-2 text-sm">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Status</span>
                                <Badge variant="outline" className="capitalize">
                                    {organization.status || "Ativo"}
                                </Badge>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Membros</span>
                                <div className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    <span>{organization.members.length}</span>
                                </div>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Criado em</span>
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(organization.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Equipe Médica
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {organization.members.slice(0, 5).map((member) => (
                                <div key={member.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={member.user.image || undefined} />
                                            <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{member.user.name}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{member.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {organization.members.length > 5 && (
                                <p className="text-xs text-center text-muted-foreground pt-2">
                                    + {organization.members.length - 5} outros membros
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
