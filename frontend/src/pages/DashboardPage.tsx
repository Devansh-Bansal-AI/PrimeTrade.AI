import { useEffect, useState } from "react";
import { taskApi } from "../api/taskApi";
import { Alert } from "../components/Alert";
import { useAuth } from "../hooks/useAuth";
import { Task } from "../types";
import { getApiErrorMessage } from "../utils/apiError";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await taskApi.list({ page: 1, limit: 100 });
        setTasks(response.items);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError, "Failed to load dashboard stats."));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const todoCount = tasks.filter((task) => task.status === "todo").length;
  const progressCount = tasks.filter((task) => task.status === "in_progress").length;
  const doneCount = tasks.filter((task) => task.status === "done").length;

  return (
    <section>
      <h2 className="text-xl font-semibold text-slate-900">Welcome, {user?.name}</h2>
      <p className="text-sm text-slate-600 mt-1">
        {user?.role === "admin"
          ? "Admin view enabled. You can manage all tasks and users via API."
          : "You can manage your own tasks from the task page."}
      </p>
      {error ? <Alert tone="error" message={error} /> : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <StatCard title="Todo" value={loading ? "-" : String(todoCount)} />
        <StatCard title="In Progress" value={loading ? "-" : String(progressCount)} />
        <StatCard title="Done" value={loading ? "-" : String(doneCount)} />
      </div>
    </section>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4">
    <p className="text-sm text-slate-600">{title}</p>
    <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
  </div>
);
