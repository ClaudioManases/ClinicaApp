import { ListarPacientesAdmin } from "./_components/listar-pacientes";

export default function AdminDoctorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Pacientes</h1>
        <p className="text-muted-foreground mt-2">Visualize e gerencie todos os pacientes</p>
      </div>

      <ListarPacientesAdmin />
    </div>
  );
}

