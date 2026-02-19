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
import { Loader, Plus, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function MinhaAgendaDoctorComponent() {
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

  const upcomingAppointments = appointments?.filter((apt: any) => {
    const aptDate = new Date(apt.dateTime);
    const now = new Date();
    return aptDate > now;
  }).sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Minha Agenda</h1>
          <p className="text-muted-foreground">Visualize e gerencie suas consultas</p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Consulta
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
                <Label htmlFor="reason">Motivo da Consulta</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Ex: Consulta de rotina, acompanhamento..."
                />
              </div>

              <Button onClick={handleSubmit} disabled={isPending} className="w-full">
                {isPending ? "Agendando..." : "Agendar Consulta"}
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
      ) : upcomingAppointments.length > 0 ? (
        <div className="space-y-4">
          {upcomingAppointments.map((apt: any) => {
            const aptDate = new Date(apt.dateTime);
            const now = new Date();
            const isToday = aptDate.toLocaleDateString() === now.toLocaleDateString();

            return (
              <Card key={apt.id} className={isToday ? "border-blue-200 bg-blue-50" : ""}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Calendar className={`w-5 h-5 mt-1 ${isToday ? 'text-blue-600' : 'text-muted-foreground'}`} />
                      <div>
                        <h3 className="font-semibold text-lg">{apt.patientName || "Paciente"}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            {aptDate.toLocaleDateString("pt-BR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })} às {aptDate.toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {apt.reason && (
                          <p className="text-sm text-muted-foreground mt-2">
                            <strong>Motivo:</strong> {apt.reason}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      {isToday && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Hoje
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">Nenhuma consulta agendada</p>
            <Button onClick={() => setOpenDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Agendar Primeira Consulta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

