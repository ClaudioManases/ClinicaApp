import "./globals.css";

import type { Metadata } from "next";
import { BackgroundRippleEffect } from "@/components/background-ripple-effect";
import Header from "@/components/header";
import Providers from "@/components/providers";
import { createMetadata } from "@/lib/metadata";
import localFont from 'next/font/local'

const roboto = localFont({
    src: [
        {
            path: './../../public/Roboto-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: './../../public/Roboto-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
    ],
})

export const metadata: Metadata = createMetadata({
	title: {
		template: "%s | Better Auth",
		default: "Better Auth",
	},
	description: "The most comprehensive authentication framework for TypeScript",
	metadataBase: new URL("https://demo.better-auth.com"),
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon/favicon.ico" sizes="any" />
			</head>
			<body className={`${roboto.className} font-sans`}>
				<Providers>
                    {children}
                </Providers>
			</body>
		</html>
	);
}
