"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Building2, Camera, Mail, MapPin, Phone } from "lucide-react";

export default function ClinicInfoPage() {
    const [loading, setLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "Clínica Saúde Total",
        email: "contato@saudetotal.com.br",
        phone: "(11) 3333-4444",
        address: "Av. Paulista, 1000 - Bela Vista, São Paulo - SP",
        description: "Clínica especializada em atendimento humanizado e tecnologia de ponta.",
        website: "www.saudetotal.com.br"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Informações da clínica atualizadas com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar informações.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dados da Clínica</h1>
                <p className="text-muted-foreground">
                    Gerencie as informações públicas da sua organização.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
                {/* Logo Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Logotipo</CardTitle>
                        <CardDescription>
                            Esta imagem será exibida no cabeçalho e documentos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-4">
                        <div className="relative group">
                            <Avatar className="w-32 h-32 border-4 border-muted">
                                <AvatarImage src={logoPreview || "/placeholder-clinic.jpg"} className="object-cover" />
                                <AvatarFallback className="text-4xl">ST</AvatarFallback>
                            </Avatar>
                            <label 
                                htmlFor="logo-upload" 
                                className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                            >
                                <Camera className="w-8 h-8" />
                            </label>
                            <input 
                                id="logo-upload" 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleLogoChange}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Recomendado: 500x500px (JPG, PNG)
                        </p>
                    </CardContent>
                </Card>

                {/* General Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Gerais</CardTitle>
                        <CardDescription>
                            Detalhes de contato e localização.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nome da Clínica</Label>
                            <div className="relative">
                                <Building2 className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email de Contato</Label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Telefone Principal</Label>
                                <div className="relative">
                                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address">Endereço Completo</Label>
                            <div className="relative">
                                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                placeholder="https://"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Sobre a Clínica</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
