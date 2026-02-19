import { ListarAgendamentosAdmin } from "./_components/listar-agendamentos";

export default function AdminPatientsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Agendamentos</h1>
        <p className="text-muted-foreground mt-2">Visualize e gerencie todos os agendamentos</p>
      </div>

      <ListarAgendamentosAdmin />
    </div>
  );
}

