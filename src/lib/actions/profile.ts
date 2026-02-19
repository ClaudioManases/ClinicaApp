"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Schema for Doctor Profile
const doctorProfileSchema = z.object({
  phone: z.string().min(9, "Número de telefone inválido").optional().or(z.literal('')),
  biografia: z.string().min(10, "Biografia deve ter pelo menos 10 caracteres.").max(500),
  especialidade: z.string().min(2, "Especialidade é obrigatória."),
  numeroLicenca: z.string().min(4, "Número de licença é obrigatório."),
  anosExperiencia: z.coerce.number().min(0, "Anos de experiência não pode ser negativo.").optional(),
});

// Schema for Admin Profile
const adminProfileSchema = z.object({
  phone: z.string().min(9, "Número de telefone inválido").optional().or(z.literal('')),
  departamento: z.string().min(2, "Departamento é obrigatório."),
});

export async function completeProfile(
  profileType: "doctor" | "admin" | "superadmin",
  formData: unknown
) {
  const session = await auth.api.getSession();
  if (!session) {
    throw new Error("Não autenticado.");
  }

  const { user } = session;

  try {
    if (profileType === "doctor") {
      const data = doctorProfileSchema.parse(formData);
      await prisma.$transaction(async (tx) => {
        await tx.doctorProfile.create({
          data: {
            userId: user.id,
            biografia: data.biografia,
            especialidade: data.especialidade,
            numeroLicenca: data.numeroLicenca,
            anosExperiencia: data.anosExperiencia,
          },
        });
        await tx.user.update({
          where: { id: user.id },
          data: { 
            profileType: "doctor",
            phone: data.phone 
          },
        });
      });
    } else if (profileType === "admin") {
      const data = adminProfileSchema.parse(formData);
      await prisma.$transaction(async (tx) => {
        await tx.adminProfile.create({
          data: {
            userId: user.id,
            departamento: data.departamento,
          },
        });
        await tx.user.update({
          where: { id: user.id },
          data: { 
            profileType: "admin",
            phone: data.phone
          },
        });
      });
    } else {
      // Handle other profiles if necessary
      throw new Error("Tipo de perfil inválido.");
    }

    revalidatePath("/dashboard", "layout"); // Revalidate to refresh user session data across the app
    return { success: true, message: "Perfil atualizado com sucesso!" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Dados inválidos.", errors: error.flatten().fieldErrors };
    }
    console.error("Error completing profile:", error);
    return { success: false, message: "Ocorreu um erro ao atualizar o perfil." };
  }
}
