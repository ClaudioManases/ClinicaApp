import { z } from "zod";

export const patientSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(9, "Telefone inválido").optional(),
    birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Data de nascimento inválida",
    }),
    gender: z.enum(["male", "female", "other"], {
        errorMap: () => ({ message: "Selecione um género válido" }),
    }),
    address: z.string().optional(),
});

export type PatientInput = z.infer<typeof patientSchema>;
