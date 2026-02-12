'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { ContactInfoSection } from './ContactInfoSection'
import { AuthMethodsSection } from './AuthMethodsSection'
import { AccountPortalSection } from './AccountPortalSection'

const userSettingsSchema = z.object({
    // Contact Information
    enableEmail: z.boolean(),
    emailRequiresPassword: z.boolean(),
    emailVerifyAtSignup: z.boolean(),
    enablePhone: z.boolean(),

    // Username
    enableUsername: z.boolean(),

    // Authentication strategies
    lessThanOneShotAuth: z.boolean(),

    // Personalized
    personalizedSignin: z.boolean(),
    persistentTokens: z.boolean(),
    allowSocialConnections: z.boolean(),
    allowWebWallet: z.boolean(),

    // Account Portal
    enableAccountPortal: z.boolean(),
    enableActions: z.boolean(),
    enableEmails: z.boolean(),
    enableSMS: z.boolean(),
})

type UserSettingsFormValues = z.infer<typeof userSettingsSchema>

export function UserSettingsForm() {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<UserSettingsFormValues>({
        resolver: zodResolver(userSettingsSchema),
        defaultValues: {
            enableEmail: true,
            emailRequiresPassword: true,
            emailVerifyAtSignup: true,
            enablePhone: false,
            enableUsername: false,
            lessThanOneShotAuth: false,
            personalizedSignin: true,
            persistentTokens: true,
            allowSocialConnections: true,
            allowWebWallet: true,
            enableAccountPortal: true,
            enableActions: true,
            enableEmails: true,
            enableSMS: false,
        },
    })

    async function onSubmit(data: UserSettingsFormValues) {
        setIsLoading(true)

        try {
            const response = await fetch('/api/user-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (response.ok) {
                toast({
                    title: 'Settings saved',
                    description: 'User settings have been updated successfully.',
                })
            } else {
                throw new Error('Failed to save settings')
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Failed to save settings. Please try again.',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <ContactInfoSection form={form} />

                <AuthMethodsSection form={form} />

                <AccountPortalSection form={form} />

                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}