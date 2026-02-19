// prisma/seed-correct.ts
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";


async function createSuperAdmin() {
    try {
        const ctx = await auth.$context;

        const superadminEmail = "superadmin@example.com";
        const superadminPassword = "123456789";
        const superadminName = "SUPER_ADMINISTRATOR";
        const superadminNumber = "123456789";

        // Verifica se admin já existe
        const existingUser = await ctx.internalAdapter.findUserByEmail(superadminEmail);

        if (!existingUser) {
            // Cria o usuário
            const user = await ctx.internalAdapter.createUser({
                email: superadminEmail,
                name: superadminName,
                emailVerified: true,
                role: "super_admin",
                phone: superadminNumber,
                profileType: "super_admin",
            });

            // Criar a conta com senha
            await ctx.internalAdapter.createAccount({
                accountId: user.id,
                providerId: "credential",
                userId: user.id,
                password: await ctx.password.hash(superadminPassword),
            });

            // Criar o perfil específico baseado no profileType
            await createProfileForUser(user.id, user.profileType);

            console.log("Admin user created successfully!");
            console.log("Email:", superadminEmail);
            console.log("Password:", superadminPassword);
        } else {
            console.log("Admin user already exists!");
        }
    } catch (error) {
        console.error("Error creating admin user:", error);
        throw error;
    }
}

async function createAdmin() {
    try {
        const ctx = await auth.$context;

        const superadminEmail = "admin@example.com";
        const superadminPassword = "123456789";
        const superadminName = "ADMINISTRATOR";
        const superadminNumber = "2345678903";

        // Verifica se admin já existe
        const existingUser = await ctx.internalAdapter.findUserByEmail(superadminEmail);

        if (!existingUser) {
            // Cria o usuário
            const user = await ctx.internalAdapter.createUser({
                email: superadminEmail,
                name: superadminName,
                emailVerified: true,
                role: "admin",
                phone: superadminNumber,
                profileType: "admin",

            });

            // Criar a conta com senha
            await ctx.internalAdapter.createAccount({
                accountId: user.id,
                providerId: "credential",
                userId: user.id,
                password: await ctx.password.hash(superadminPassword),
            });

            // Criar o perfil específico baseado no profileType
            await createProfileForUser(user.id, user.profileType);

            console.log("Admin user created successfully!");
            console.log("Email:", superadminEmail);
            console.log("Password:", superadminPassword);
        } else {
            console.log("Admin user already exists!");
        }
    } catch (error) {
        console.error("Error creating admin user:", error);
        throw error;
    }
}

async function createDoctor() {
    try {
        const ctx = await auth.$context;

        const superadminEmail = "doctor@example.com";
        const superadminPassword = "123456789";
        const superadminName = "MEDICO";
        const superadminNumber = "2345678903";

        // Verifica se admin já existe
        const existingUser = await ctx.internalAdapter.findUserByEmail(superadminEmail);

        if (!existingUser) {
            // Cria o usuário
            const user = await ctx.internalAdapter.createUser({
                email: superadminEmail,
                name: superadminName,
                emailVerified: true,
                role: "doctor",
                phone: superadminNumber,
                profileType: "doctor",
            });

            // Criar a conta com senha
            await ctx.internalAdapter.createAccount({
                accountId: user.id,
                providerId: "credential",
                userId: user.id,
                password: await ctx.password.hash(superadminPassword),
            });

            // Criar o perfil específico baseado no profileType
            await createProfileForUser(user.id, user.profileType);

            console.log("Doctor user created successfully!");
            console.log("Email:", superadminEmail);
            console.log("Password:", superadminPassword);
        } else {
            console.log("Doctor user already exists!");
        }
    } catch (error) {
        console.error("Error creating admin user:", error);
        throw error;
    }
}


async function createProfileForUser(userId: string, profileType: string) {
    try {
        switch (profileType) {

            case "doctor":
                await prisma.doctorProfile.create({
                    data: {
                        userId: userId,
                        biografia:"lorem inpsum met dolor",
                        especialidade: ["Clínica Geral","pedriatria","genicologia"],
                        numeroLicenca: `DOC-${Date.now()}`,
                        anosExperiencia: 5,
                        horarioAtendimento:["07:00","10:00","12:00"],
                        disponibilidade:["seg","ter","qua","quin"],
                    }
                });
                break;
            case "super_admin":
                // Para superadmin, você pode criar um perfil específico
                await prisma.superAdminProfile.create({
                    data: {
                        userId: userId,
                        nivelAcesso: "total",
                        logsAcesso: true
                    }
                });
                console.log(`SuperAdmin profile created for user ${userId}`);
                break;
            case "admin":
                console.log(`Admin profile created for user ${userId}`);
                await prisma.adminProfile.create({
                    data:{
                        userId:userId,
                        departamento: "saude",
                        nivelAcesso: "total",

                    }
                })
                break;

            default:
                console.log(`Unknown profile type: ${profileType}`);
        }
    } catch (error) {
        console.error(`Error creating profile for user ${userId}:`, error);
        throw error;
    }
}

// Executar o seed
createSuperAdmin().then(() => {
    console.log("Seed completed successfully!");
    process.exit(0);
})
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    });
{/*
createSuperAdmin().then(() => {
    console.log("Seed completed successfully!");
    process.exit(0);
})
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    });
createAdmin()
    .then(() => {
        console.log("Seed completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    });

createDoctor()
    .then(() => {
    console.log("Seed completed successfully!");
    process.exit(0);
})
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    });

createUser()
    .then(() => {
    console.log("Seed completed successfully!");
    process.exit(0);
})
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    });*/}