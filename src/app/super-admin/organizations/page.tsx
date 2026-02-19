"use client";

import { usePatientsQuery } from "@/hooks/use-patients-bff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Search, Shield, Trash2, Eye } from "lucide-react";
import { useState } from "react";

export function SuperAdminUsersComponent() {
  const { data: patients, isLoading } = usePatientsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = patients?.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Usuários</h1>
        <p className="text-muted-foreground">Gerencie todos os usuários do sistema</p>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : filteredUsers.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Telefone</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user: any, index: number) => (
                  <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                    <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-sm">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.phone || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Visualizar
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-2">
                          <Trash2 className="w-4 h-4" />
                          Deletar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário no sistema"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Informações de Super Admin</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <p>Como super admin, você tem acesso total ao sistema:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Visualizar e gerenciar todos os usuários</li>
            <li>Ver todas as organizações cadastradas</li>
            <li>Monitorar agendamentos e exames</li>
            <li>Acessar logs de auditoria</li>
            <li>Gerenciar configurações globais do sistema</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

