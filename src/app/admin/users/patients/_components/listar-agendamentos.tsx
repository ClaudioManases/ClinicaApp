"use client";

import { useAppointmentsQuery, useCreateAppointmentMutation } from "@/hooks/use-appointments-bff";
import { usePatientsQuery } from "@/hooks/use-patients-bff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Plus, Calendar } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ListarAgendamentosAdmin() {
  const { data: appointments, isLoading } = useAppointmentsQuery();
  const { data: patients } = usePatientsQuery();
  const { mutate: criarAgendamento, isPending } = useCreateAppointmentMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    dateTime: "",
    reason: "",
  });

  const handleSubmit = () => {
    if (!formData.patientId || !formData.dateTime) {
      alert("Selecione um paciente e data");
      return;
    }

    criarAgendamento(formData);
    setFormData({ patientId: "", doctorId: "", dateTime: "", reason: "" });
    setOpenDialog(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Agendamentos</h2>
          <p className="text-muted-foreground">Gerencie agendamentos da clínica</p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Agendamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Consulta</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Paciente</Label>
                <Select value={formData.patientId} onValueChange={(val) => setFormData({ ...formData, patientId: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients?.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dateTime">Data e Hora</Label>
                <Input
                  id="dateTime"
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="reason">Motivo</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Ex: Consulta de rotina"
                />
              </div>

              <Button onClick={handleSubmit} disabled={isPending} className="w-full">
                {isPending ? "Agendando..." : "Agendar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      ) : appointments && appointments.length > 0 ? (
        <div className="grid gap-4">
          {appointments.map((apt: any) => (
            <Card key={apt.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{apt.patientName || "Paciente"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(apt.dateTime).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {apt.reason && (
                        <p className="text-sm text-muted-foreground">{apt.reason}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                      apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">Nenhum agendamento</p>
            <Button onClick={() => setOpenDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeiro Agendamento
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

