import { useEffect, useState } from "react";
import { Alert } from "../components/Alert";
import { TaskForm } from "../components/TaskForm";
import { TaskTable } from "../components/TaskTable";
import { taskApi } from "../api/taskApi";
import { useAuth } from "../hooks/useAuth";
import { Task, TaskPriority, TaskStatus } from "../types";
import { getApiErrorMessage } from "../utils/apiError";

type FilterState = {
  search: string;
  status: TaskStatus | "";
  priority: TaskPriority | "";
  page: number;
  limit: number;
};

export const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "",
    priority: "",
    page: 1,
    limit: 10
  });
  const [draftFilters, setDraftFilters] = useState<FilterState>(filters);

  const loadTasks = async () => {
    setTableLoading(true);
    try {
      const response = await taskApi.list(filters);
      setTasks(response.items);
      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (error: unknown) {
      setMessage({ tone: "error", text: getApiErrorMessage(error, "Failed to fetch tasks.") });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, [filters]);

  const onSubmit = async (values: {
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
  }) => {
    setLoading(true);
    setMessage(null);
    try {
      if (editingTask) {
        await taskApi.update(editingTask._id, values);
        setMessage({ tone: "success", text: "Task updated successfully." });
      } else {
        await taskApi.create(values);
        setMessage({ tone: "success", text: "Task created successfully." });
      }
      setEditingTask(null);
      await loadTasks();
    } catch (error: unknown) {
      setMessage({ tone: "error", text: getApiErrorMessage(error, "Failed to save task.") });
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await taskApi.remove(id);
      setMessage({ tone: "success", text: "Task deleted successfully." });
      await loadTasks();
    } catch (error: unknown) {
      setMessage({ tone: "error", text: getApiErrorMessage(error, "Failed to delete task.") });
    }
  };

  const applyFilters = () => {
    setFilters((previous) => ({
      ...draftFilters,
      page: 1,
      limit: previous.limit
    }));
  };

  const resetFilters = () => {
    const initialState: FilterState = {
      search: "",
      status: "",
      priority: "",
      page: 1,
      limit: 10
    };
    setDraftFilters(initialState);
    setFilters(initialState);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Task Management</h2>
      </div>
      <p className="text-sm text-slate-600">
        {user?.role === "admin" ? "Admin scope: viewing and managing tasks across all users." : "User scope: manage only your own tasks."}
      </p>

      {message ? <Alert tone={message.tone} message={message.text} /> : null}

      <TaskForm initialTask={editingTask} loading={loading} onSubmit={onSubmit} />

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input
            placeholder="Search by title/description"
            className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            value={draftFilters.search}
            onChange={(event) => setDraftFilters((prev) => ({ ...prev, search: event.target.value }))}
          />
          <select
            value={draftFilters.status}
            onChange={(event) =>
              setDraftFilters((prev) => ({
                ...prev,
                status: event.target.value as TaskStatus | ""
              }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={draftFilters.priority}
            onChange={(event) =>
              setDraftFilters((prev) => ({
                ...prev,
                priority: event.target.value as TaskPriority | ""
              }))
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button className="rounded-lg bg-slate-900 text-white text-sm px-3 py-2 hover:bg-slate-800" onClick={applyFilters}>
            Apply
          </button>
          <button className="rounded-lg border border-slate-300 text-sm px-3 py-2 hover:bg-slate-100" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      {tableLoading ? (
        <div className="text-sm text-slate-500">Loading tasks...</div>
      ) : (
        <TaskTable tasks={tasks} canSeeOwner={user?.role === "admin"} onEdit={setEditingTask} onDelete={onDelete} />
      )}

      <div className="flex items-center justify-between text-sm text-slate-600">
        <p>
          Total: {meta.total} | Page {meta.page} of {meta.totalPages}
        </p>
        <div className="space-x-2">
          <button
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={meta.page <= 1}
            className="px-3 py-1 rounded border border-slate-300 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() =>
              setFilters((prev) => ({
                ...prev,
                page: Math.min(meta.totalPages, prev.page + 1)
              }))
            }
            disabled={meta.page >= meta.totalPages}
            className="px-3 py-1 rounded border border-slate-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};
