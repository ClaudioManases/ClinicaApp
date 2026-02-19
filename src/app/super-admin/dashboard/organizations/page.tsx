"use client";

import { useOrganizationListQuery } from "@/data/organization/organization-list-query";
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
import { Loader2, MoreHorizontal, Shield, ShieldOff } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { organizationKeys } from "@/data/organization/keys";

async function updateOrganizationStatus({ id, status }: { id: string, status: string }) {
    // This is a placeholder for the actual API call.
    // You would need to implement this mutation in your backend.
    console.log(`Updating organization ${id} to status ${status}`);
    // Example of what the mutation could look like with better-auth:
    // const { error } = await authClient.organization.update({ id, data: { status } });
    // if (error) throw new Error(error.message);
    
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(`Organization status updated to ${status}`);
}

export default function SuperAdminOrganizationsPage() {
    const queryClient = useQueryClient();
    const { data: organizations, isLoading } = useOrganizationListQuery();

    const updateStatusMutation = useMutation({
        mutationFn: updateOrganizationStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: organizationKeys.list() });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update status");
        },
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Organizações</h1>
                <p className="text-muted-foreground">
                    Visualize e gerencie todas as organizações da plataforma.
                </p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Todas as Organizações</CardTitle>
                    <CardDescription>
                        Total de {organizations?.length || 0} organizações registradas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Organização</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Membros</TableHead>
                                <TableHead>Criado em</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {organizations?.map((org) => (
                                <TableRow key={org.id}>
                                    <TableCell className="font-medium flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={org.logo || undefined} />
                                            <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p>{org.name}</p>
                                            <p className="text-xs text-muted-foreground">@{org.slug}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant={org.status === 'active' ? 'default' : 'destructive'} 
                                            className="capitalize"
                                        >
                                            {org.status || "active"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{org.members?.length || 0}</TableCell>
                                    <TableCell>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
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
                                                <DropdownMenuItem
                                                    onClick={() => updateStatusMutation.mutate({ id: org.id, status: 'active' })}
                                                >
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    Ativar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="text-orange-600 focus:text-orange-600"
                                                    onClick={() => updateStatusMutation.mutate({ id: org.id, status: 'suspended' })}
                                                >
                                                    <ShieldOff className="mr-2 h-4 w-4" />
                                                    Suspender
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
