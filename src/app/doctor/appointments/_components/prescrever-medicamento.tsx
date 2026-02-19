                        )}
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Prescrito em: {new Date(prescription.prescribedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Pill className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">Nenhuma prescrição realizada</p>
            <Button onClick={() => setOpenDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeira Prescrição
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
"use client";

import { usePrescriptionsQuery, useCreatePrescriptionMutation } from "@/hooks/use-prescriptions-bff";
import { usePatientsQuery } from "@/hooks/use-patients-bff";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader, Plus, Pill } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function PrescreverMedicamentoDoctorComponent() {
  const { data: prescriptions, isLoading } = usePrescriptionsQuery();
  const { data: patients } = usePatientsQuery();
  const { mutate: prescrever, isPending } = useCreatePrescriptionMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    medicineId: "",
    dosage: "",
    duration: "",
    notes: "",
  });

  const medicines = [
    { id: "paracetamol", name: "Paracetamol 500mg" },
    { id: "dipirona", name: "Dipirona 500mg" },
    { id: "amoxicilina", name: "Amoxicilina 500mg" },
    { id: "ibuprofeno", name: "Ibuprofeno 200mg" },
    { id: "metformina", name: "Metformina 850mg" },
    { id: "atorvastatina", name: "Atorvastatina 20mg" },
  ];

  const handleSubmit = () => {
    if (!formData.patientId || !formData.medicineId || !formData.dosage || !formData.duration) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    prescrever(formData);
    setFormData({ patientId: "", medicineId: "", dosage: "", duration: "", notes: "" });
    setOpenDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prescrições</h1>
          <p className="text-muted-foreground">Prescreva medicamentos para seus pacientes</p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Prescrição
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Prescrever Medicamento</DialogTitle>
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
                <Label>Medicamento</Label>
                <Select value={formData.medicineId} onValueChange={(val) => setFormData({ ...formData, medicineId: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o medicamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicines.map((med) => (
                      <SelectItem key={med.id} value={med.id}>
                        {med.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dosage">Dosagem</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  placeholder="Ex: 1 comprimido a cada 8 horas"
                />
              </div>

              <div>
                <Label htmlFor="duration">Duração do Tratamento</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Ex: 7 dias, 2 semanas"
                />
              </div>

              <div>
                <Label htmlFor="notes">Observações (opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ex: Tomar com alimentos, evitar álcool..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSubmit} disabled={isPending} className="w-full">
                {isPending ? "Prescrevendo..." : "Prescrever"}
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
      ) : prescriptions && prescriptions.length > 0 ? (
        <div className="space-y-4">
          {prescriptions.map((prescription: any) => (
            <Card key={prescription.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Pill className="w-5 h-5 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg">{prescription.medicineName || "Medicamento"}</h3>
                      <p className="text-sm text-muted-foreground">{prescription.patientName || "Paciente"}</p>

                      <div className="mt-3 space-y-1 text-sm">
                        <p><strong>Dosagem:</strong> {prescription.dosage}</p>
                        <p><strong>Duração:</strong> {prescription.duration}</p>
                        {prescription.notes && (
                          <p><strong>Observações:</strong> {prescription.notes}</p>
"use client";

import { usePatientsQuery } from "@/hooks/use-patients-bff";
import { useAppointmentsQuery } from "@/hooks/use-appointments-bff";
import { useExamsQuery } from "@/hooks/use-exams-bff";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, Users, Calendar, TestTube, BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SuperAdminDashboardContent() {
  const { data: patients, isLoading: patientsLoading } = usePatientsQuery();
  const { data: appointments, isLoading: appointmentsLoading } = useAppointmentsQuery();
  const { data: exams, isLoading: examsLoading } = useExamsQuery();

  const totalPatients = patients?.length || 0;
  const totalAppointments = appointments?.length || 0;
  const totalExams = exams?.length || 0;
  const pendingExams = exams?.filter((e: any) => e.status === 'pending').length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Gerenciamento global do sistema</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {patientsLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <div>
                <div className="text-2xl font-bold">{totalPatients}</div>
                <p className="text-xs text-muted-foreground">No sistema</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {appointmentsLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <div>
                <div className="text-2xl font-bold">{totalAppointments}</div>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exames</CardTitle>
            <TestTube className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {examsLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <div>
                <div className="text-2xl font-bold">{totalExams}</div>
                <p className="text-xs text-muted-foreground">{pendingExams} pendentes</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {examsLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <div>
                <div className="text-2xl font-bold">
                  {totalExams > 0 ? Math.round(((totalExams - pendingExams) / totalExams) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">De exames</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="patients" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients">Pacientes</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
          <TabsTrigger value="exams">Exames</TabsTrigger>
        </TabsList>

        {/* Pacientes Tab */}
        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Pacientes</CardTitle>
              <CardDescription>Visualize todos os pacientes do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {patientsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin" />
                </div>
              ) : patients && patients.length > 0 ? (
                <div className="space-y-3">
                  {patients.slice(0, 10).map((patient: any) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                      </div>
                      <div className="text-right text-sm">
                        {patient.phone && <p>{patient.phone}</p>}
                      </div>
                    </div>
                  ))}
                  {patients.length > 10 && (
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      +{patients.length - 10} pacientes adicionais
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Nenhum paciente</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Agendamentos Tab */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos Recentes</CardTitle>
              <CardDescription>Últimos agendamentos do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin" />
                </div>
              ) : appointments && appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.slice(0, 10).map((apt: any) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{apt.patientName || "Paciente"}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(apt.dateTime).toLocaleDateString("pt-BR", {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Nenhum agendamento</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exames Tab */}
        <TabsContent value="exams">
          <Card>
            <CardHeader>
              <CardTitle>Exames Solicitados</CardTitle>
              <CardDescription>Status de todos os exames</CardDescription>
            </CardHeader>
            <CardContent>
              {examsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader className="w-6 h-6 animate-spin" />
                </div>
              ) : exams && exams.length > 0 ? (
                <div className="space-y-3">
                  {exams.slice(0, 10).map((exam: any) => (
                    <div key={exam.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{exam.type}</p>
                        <p className="text-sm text-muted-foreground">{exam.patientName || "Paciente"}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        exam.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        exam.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {exam.status === 'pending' ? 'Pendente' :
                         exam.status === 'completed' ? 'Concluído' : 'Cancelado'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">Nenhum exame</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

