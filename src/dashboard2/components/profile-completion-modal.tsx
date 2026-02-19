"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { completeProfile } from "@/lib/actions/profile"; // Import the server action

// Define schemas for different roles
const doctorSchema = z.object({
  phone: z.string().min(9, "Telefone inválido").optional().or(z.literal('')),
  biografia: z.string().min(10, "A biografia deve ter pelo menos 10 caracteres.").max(500, "A biografia deve ter no máximo 500 caracteres."),
  especialidade: z.string().min(1, "Selecione uma especialidade."),
  numeroLicenca: z.string().min(4, "Número da licença é obrigatório."),
  anosExperiencia: z.coerce.number().min(0, "Anos de experiência inválido."),
});

const adminSchema = z.object({
  phone: z.string().min(9, "Telefone inválido").optional().or(z.literal('')),
  departamento: z.string().min(2, "Departamento é obrigatório."),
});

// Union type for form data
type FormData = z.infer<typeof doctorSchema> | z.infer<typeof adminSchema>;

export function ProfileCompletionModal() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Determine the schema based on the user role
  const role = session?.user?.role || "doctor";
  const schema = role === "admin" ? adminSchema : doctorSchema;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      phone: "",
      biografia: "",
      especialidade: "",
      numeroLicenca: "",
      anosExperiencia: 0,
      departamento: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      // Check if profile is incomplete
      // Assuming 'profileType' is null or undefined if incomplete
      // You might need to adjust this logic based on your actual data structure
      const isProfileIncomplete = !session.user.profileType;

      if (isProfileIncomplete) {
        setOpen(true);
      }
    }
  }, [session]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const result = await completeProfile(role as "doctor" | "admin", data);

      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.message || "Erro ao atualizar perfil.");
        if (result.errors) {
            // Handle field errors if returned from server
            console.error(result.errors);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete seu Perfil</DialogTitle>
          <DialogDescription>
            Precisamos de algumas informações adicionais para configurar sua conta como{" "}
            <span className="font-semibold capitalize">{role}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {role === "doctor" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="especialidade">Especialidade</Label>
                <Select
                  onValueChange={(val) => setValue("especialidade", val)}
                  defaultValue={watch("especialidade")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardiologia">Cardiologia</SelectItem>
                    <SelectItem value="clinica_geral">Clínica Geral</SelectItem>
                    <SelectItem value="pediatria">Pediatria</SelectItem>
                    <SelectItem value="ortopedia">Ortopedia</SelectItem>
                    <SelectItem value="dermatologia">Dermatologia</SelectItem>
                  </SelectContent>
                </Select>
                {errors.especialidade && (
                  <p className="text-sm text-red-500">
                    {errors.especialidade.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="numeroLicenca">CRM / Número da Licença</Label>
                <Input
                  id="numeroLicenca"
                  placeholder="000000/UF"
                  {...register("numeroLicenca")}
                />
                {errors.numeroLicenca && (
                  <p className="text-sm text-red-500">
                    {errors.numeroLicenca.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="anosExperiencia">Anos de Experiência</Label>
                <Input
                  id="anosExperiencia"
                  type="number"
                  placeholder="Ex: 5"
                  {...register("anosExperiencia")}
                />
                {errors.anosExperiencia && (
                  <p className="text-sm text-red-500">
                    {errors.anosExperiencia.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="biografia">Biografia Resumida</Label>
                <Textarea
                  id="biografia"
                  placeholder="Fale um pouco sobre sua experiência..."
                  {...register("biografia")}
                />
                {errors.biografia && (
                  <p className="text-sm text-red-500">
                    {errors.biografia.message}
                  </p>
                )}
              </div>
            </>
          )}

          {role === "admin" && (
            <div className="grid gap-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                placeholder="Ex: Financeiro, Recursos Humanos"
                {...register("departamento")}
              />
              {errors.departamento && (
                <p className="text-sm text-red-500">
                  {errors.departamento.message}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Informações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
