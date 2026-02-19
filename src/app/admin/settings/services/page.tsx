"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function ServicesPage() {
    const [services, setServices] = useState([
        { id: 1, name: "Consulta Geral", price: 150.00, duration: "30 min" },
        { id: 2, name: "Exame de Sangue", price: 80.00, duration: "15 min" },
        { id: 3, name: "Raio-X", price: 120.00, duration: "20 min" },
    ]);

    const [newService, setNewService] = useState({ name: "", price: "", duration: "" });
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddService = () => {
        if (!newService.name || !newService.price) {
            toast.error("Preencha todos os campos obrigatórios.");
            return;
        }

        const service = {
            id: services.length + 1,
            name: newService.name,
            price: parseFloat(newService.price),
            duration: newService.duration
        };

        setServices([...services, service]);
        setNewService({ name: "", price: "", duration: "" });
        setIsDialogOpen(false);
        toast.success("Serviço adicionado com sucesso!");
    };

    const handleDeleteService = (id: number) => {
        setServices(services.filter(s => s.id !== id));
        toast.success("Serviço removido.");
    };

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Serviços e Preços</h1>
                    <p className="text-muted-foreground">
                        Gerencie os serviços oferecidos pela clínica e seus valores.
                    </p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Adicionar Serviço
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Novo Serviço</DialogTitle>
                            <DialogDescription>
                                Adicione um novo serviço ao catálogo da clínica.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome do Serviço</Label>
                                <Input
                                    id="name"
                                    value={newService.name}
                                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                    placeholder="Ex: Consulta Cardiológica"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Preço (R$)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="duration">Duração Estimada</Label>
                                    <Input
                                        id="duration"
                                        value={newService.duration}
                                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                                        placeholder="Ex: 30 min"
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddService}>Salvar Serviço</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Catálogo de Serviços</CardTitle>
                    <CardDescription>
                        Lista de todos os procedimentos disponíveis para agendamento.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome do Serviço</TableHead>
                                <TableHead>Duração</TableHead>
                                <TableHead>Preço</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.name}</TableCell>
                                    <TableCell>{service.duration}</TableCell>
                                    <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="mr-2">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDeleteService(service.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
