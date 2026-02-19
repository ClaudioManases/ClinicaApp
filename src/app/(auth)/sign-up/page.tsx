// src/app/(auth)/sign-up/page.tsx
import { getCallbackURL } from "@/lib/shared";
import { SignUp } from "@/app/(auth)/sign-in/_components/sign-up";
import Link from "next/link";
import { AuthCarousel } from "@/app/(auth)/_components/auth-carousel";

interface PageProps {
    searchParams: Promise<{
        callbackUrl?: string;
        [key: string]: string | string[] | undefined;
    }>;
}

export default async function SignUpPage({ searchParams }: PageProps) {
    // Aguardar a promise searchParams
    const resolvedSearchParams = await searchParams;

    const params = new URLSearchParams();
    if (resolvedSearchParams.callbackUrl) {
        params.set("callbackUrl", resolvedSearchParams.callbackUrl);
    }
    const safeCallbackURL = getCallbackURL(params as any);

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto w-full max-w-sm px-4">
                    <SignUp callbackURL={safeCallbackURL} />
                    <div className="mt-4 text-center text-sm">
                        Já tem uma conta?{" "}
                        <Link href="/sign-in" className="underline hover:text-primary">
                            Faça login
                        </Link>
                    </div>
                </div>
            </div>
            <AuthCarousel />
        </div>
    );
}