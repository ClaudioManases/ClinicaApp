"use client";

import { useRequestExamMutation, useExamsQuery } from "@/hooks/use-exams-bff";
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
import { Loader, Plus, TestTube } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function SolicitarExameDoctorComponent() {
  const { data: exams, isLoading } = useExamsQuery();
  const { data: patients } = usePatientsQuery();
  const { mutate: solicitarExame, isPending } = useRequestExamMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    examType: "",
    description: "",
  });

  const examTypes = [
    { value: "sangue", label: "Exame de Sangue" },
    { value: "urina", label: "Exame de Urina" },
    { value: "raio-x", label: "Raio-X" },
    { value: "ultrassom", label: "Ultrassom" },
    { value: "tomografia", label: "Tomografia" },
    { value: "ressonancia", label: "Ressonância Magnética" },
  ];

  const handleSubmit = () => {
    if (!formData.patientId || !formData.examType) {
      alert("Selecione um paciente e tipo de exame");
      return;
    }

    solicitarExame(formData);
    setFormData({ patientId: "", examType: "", description: "" });
    setOpenDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Solicitar Exames</h1>
          <p className="text-muted-foreground">Solicite exames para seus pacientes</p>
        </div>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Exame
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Solicitar Exame</DialogTitle>
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
                <Label>Tipo de Exame</Label>
                <Select value={formData.examType} onValueChange={(val) => setFormData({ ...formData, examType: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de exame" />
                  </SelectTrigger>
                  <SelectContent>
                    {examTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Motivo ou observações do exame"
                />
              </div>

              <Button onClick={handleSubmit} disabled={isPending} className="w-full">
                {isPending ? "Solicitando..." : "Solicitar Exame"}
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
      ) : exams && exams.length > 0 ? (
        <div className="space-y-4">
          {exams.map((exam: any) => (
            <Card key={exam.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <TestTube className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-semibold">{exam.type}</h3>
                      <p className="text-sm text-muted-foreground">{exam.patientName || "Paciente"}</p>
                      {exam.description && (
                        <p className="text-sm text-muted-foreground mt-1">{exam.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      exam.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      exam.status === 'completed' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {exam.status === 'pending' ? 'Pendente' :
                       exam.status === 'completed' ? 'Concluído' : 'Cancelado'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TestTube className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">Nenhum exame solicitado</p>
            <Button onClick={() => setOpenDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Solicitar Primeiro Exame
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

