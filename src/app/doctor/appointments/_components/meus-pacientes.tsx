"use client";

import { usePatientsQuery } from "@/hooks/use-patients-bff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Plus, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCreatePatientMutation } from "@/hooks/use-patients-bff";

export function MeusPacientesDoctorComponent() {
  const { data: patients, isLoading, error } = usePatientsQuery();
  const { mutate: criarPaciente, isPending } = useCreatePatientMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert("Nome e email são obrigatórios");
      return;
    }

    criarPaciente(formData);
    setFormData({ name: "", email: "", phone: "" });
    setOpenDialog(false);
  };

  const filteredPatients = patients?.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Erro ao carregar pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meus Pacientes</h1>
          <p className="text-muted-foreground">Gerenciee seus pacientes e visualize histórico</p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Paciente</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <Button onClick={handleSubmit} disabled={isPending} className="w-full">
                {isPending ? "Salvando..." : "Salvar Paciente"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Buscar paciente por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : filteredPatients.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPatients.map((patient: any) => (
            <Card key={patient.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">{patient.name}</h3>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{patient.email}</span>
                  </div>

                  {patient.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{patient.phone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Histórico
                  </Button>
                  <Button size="sm" className="flex-1">
                    Agendar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
            </p>
            {!searchTerm && (
              <Button onClick={() => setOpenDialog(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Adicionar Primeiro Paciente
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

