'use client'

import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import { UseFormReturn } from 'react-hook-form'

interface ContactInfoSectionProps {
    form: UseFormReturn<any>
}

export function ContactInfoSection({ form }: ContactInfoSectionProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
                <CardDescription>
                    Specify whether your users should have email addresses or phone numbers.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="enableEmail"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Email address</FormLabel>
                                    <FormDescription>
                                        Users can add email addresses to their account.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {form.watch('enableEmail') && (
                        <div className="ml-6 space-y-4">
                            <FormField
                                control={form.control}
                                name="emailRequiresPassword"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Password</FormLabel>
                                            <FormDescription>
                                                Enter a password for email authentication.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="emailVerifyAtSignup"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Verify at sign-up</FormLabel>
                                            <FormDescription>
                                                Verify email at sign-up.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    <FormField
                        control={form.control}
                        name="enablePhone"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Phone number</FormLabel>
                                    <FormDescription>
                                        Users can add phone numbers to their account.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Username</h3>
                    <FormField
                        control={form.control}
                        name="enableUsername"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Username</FormLabel>
                                    <FormDescription>
                                        Users can set usernames to their account.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}