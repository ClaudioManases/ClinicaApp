// app/(auth)/admin/login/page.tsx
// ✅ COMPLETO - Arquivo NOVO

import SignIn from "@/app/(auth)/admin/login/_components/sign-in";

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600" />

            <div className="container relative flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                {/* Lado esquerdo - Branding admin */}
                <div className="relative hidden h-[100vh] flex-col bg-gray-950 p-10 text-white lg:flex dark:border-r">
                    <div className="absolute inset-0 bg-zinc-900" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <svg
                            className="mr-2 h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        Painel Administrativo
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                Área restrita. Acesso exclusivo para administradores do sistema.
                            </p>
                            <footer className="text-sm text-gray-400">
                                Ambiente seguro • 2FA obrigatório
                            </footer>
                        </blockquote>
                    </div>
                </div>

                {/* Lado direito - MESMO FORMULÁRIO DE LOGIN */}
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight text-white">
                                Acesso Administrativo
                            </h1>
                            <p className="text-sm text-gray-400">
                                Use suas credenciais institucionais
                            </p>
                        </div>
                        <SignIn />
                    </div>
                </div>
            </div>
        </div>
    );
}