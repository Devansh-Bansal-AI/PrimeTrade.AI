import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Task } from "../types";

type TaskFormValues = {
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
};

type TaskFormProps = {
  initialTask?: Task | null;
  loading?: boolean;
  onSubmit: (values: TaskFormValues) => Promise<void>;
};

export const TaskForm = ({ initialTask, loading, onSubmit }: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: ""
    }
  });

  useEffect(() => {
    if (!initialTask) {
      reset({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: ""
      });
      return;
    }

    reset({
      title: initialTask.title,
      description: initialTask.description ?? "",
      status: initialTask.status,
      priority: initialTask.priority,
      dueDate: initialTask.dueDate ? initialTask.dueDate.slice(0, 10) : ""
    });
  }, [initialTask, reset]);

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values);
      })}
      className="rounded-lg border border-slate-200 bg-white p-4"
    >
      <h3 className="text-base font-semibold text-slate-900 mb-3">
        {initialTask ? "Update Task" : "Create Task"}
      </h3>
      <label className="block mb-3">
        <span className="text-sm text-slate-700">Title</span>
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          {...register("title", { required: "Title is required", minLength: 2 })}
        />
        {errors.title ? <p className="text-xs text-red-600 mt-1">{errors.title.message}</p> : null}
      </label>

      <label className="block mb-3">
        <span className="text-sm text-slate-700">Description</span>
        <textarea className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" rows={3} {...register("description")} />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="block">
          <span className="text-sm text-slate-700">Status</span>
          <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" {...register("status")}>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-700">Priority</span>
          <select className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" {...register("priority")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-slate-700">Due Date</span>
          <input type="date" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" {...register("dueDate")} />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800 disabled:opacity-70"
      >
        {loading ? "Saving..." : initialTask ? "Save Changes" : "Create Task"}
      </button>
    </form>
  );
};
