"use client";

import { useOrganizationDetailQuery } from "@/data/organization/organization-detail-query";
import { useInviteMemberMutation } from "@/data/organization/invitation-member-mutation";
import { useMemberRemoveMutation } from "@/data/organization/member-remove-mutation";
import { useInvitationCancelMutation } from "@/data/organization/invitation-cancel-mutation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MoreHorizontal, Plus, Building2, Users, Settings, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { OrganizationRole } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminOrganizationPage() {
    const { data: organization, isLoading } = useOrganizationDetailQuery();
    const inviteMember = useInviteMemberMutation();
    const removeMember = useMemberRemoveMutation();
    const cancelInvitation = useInvitationCancelMutation();

    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<OrganizationRole>("member");

    const handleInviteMember = () => {
        if (!email) {
            toast.error("Por favor, insira um endereço de e-mail.");
            return;
        }

        inviteMember.mutate({
            email,
            role
        }, {
            onSuccess: () => {
                setIsInviteOpen(false);
                setEmail("");
                setRole("member");
            }
        });
    };

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
                <h2 className="text-xl font-semibold">Nenhuma Organização Selecionada</h2>
                <p className="text-muted-foreground max-w-md">
                    Selecione uma organização no menu lateral ou crie uma nova.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Gerenciar Organização</h1>
                    <p className="text-muted-foreground">
                        Configure detalhes da clínica e gerencie a equipe.
                    </p>
                </div>
                <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Convidar Membro
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Convidar Novo Membro</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="medico@exemplo.com"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Função</Label>
                                <Select value={role} onValueChange={(value) => setRole(value as OrganizationRole)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma função" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Administrador</SelectItem>
                                        <SelectItem value="member">Membro (Staff)</SelectItem>
                                        <SelectItem value="doctor">Médico</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleInviteMember} disabled={inviteMember.isPending}>
                                {inviteMember.isPending ? "Enviando..." : "Enviar Convite"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="members" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="members" className="gap-2">
                        <Users className="h-4 w-4" />
                        Membros & Convites
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Configurações
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="members" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Equipe Atual</CardTitle>
                            <CardDescription>
                                Gerencie os membros ativos e convites pendentes da sua organização.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>E-mail</TableHead>
                                        <TableHead>Função</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {organization.members?.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={member.user.image || undefined} />
                                                    <AvatarFallback>{member.user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {member.user.name}
                                            </TableCell>
                                            <TableCell>{member.user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={member.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
                                                    {member.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Abrir menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuItem>Editar Função</DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() => {
                                                                if (confirm("Tem certeza que deseja remover este membro?")) {
                                                                    removeMember.mutate({ memberIdOrEmail: member.id });
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Remover Membro
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    
                                    {organization.invitations?.length > 0 && (
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableCell colSpan={4} className="font-semibold text-muted-foreground py-4 text-center">
                                                Convites Pendentes
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {organization.invitations?.map((invitation) => (
                                        <TableRow key={invitation.id} className="opacity-80">
                                            <TableCell className="font-medium italic text-muted-foreground">
                                                Aguardando aceitação...
                                            </TableCell>
                                            <TableCell>{invitation.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize border-dashed">
                                                    {invitation.role} (Convidado)
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => cancelInvitation.mutate({ invitationId: invitation.id })}
                                                >
                                                    Cancelar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Detalhes da Organização</CardTitle>
                            <CardDescription>
                                Informações básicas visíveis para todos os membros.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Nome da Organização</Label>
                                <Input value={organization.name} disabled />
                            </div>
                            <div className="grid gap-2">
                                <Label>Slug (URL)</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground text-sm">clinica.app/org/</span>
                                    <Input value={organization.slug} disabled className="flex-1" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Logo URL</Label>
                                <Input value={organization.logo || ""} placeholder="https://..." disabled />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
