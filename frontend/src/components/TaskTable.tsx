import { Task } from "../types";
import { formatDate } from "../utils/date";

type TaskTableProps = {
  tasks: Task[];
  canSeeOwner: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => Promise<void>;
};

export const TaskTable = ({ tasks, canSeeOwner, onEdit, onDelete }: TaskTableProps) => (
  <div className="rounded-lg border border-slate-200 bg-white overflow-x-auto">
    <table className="w-full text-sm">
      <thead className="bg-slate-100 text-slate-700">
        <tr>
          <th className="text-left px-3 py-2">Title</th>
          <th className="text-left px-3 py-2">Status</th>
          <th className="text-left px-3 py-2">Priority</th>
          <th className="text-left px-3 py-2">Due Date</th>
          {canSeeOwner ? <th className="text-left px-3 py-2">Owner</th> : null}
          <th className="text-right px-3 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.length === 0 ? (
          <tr>
            <td colSpan={canSeeOwner ? 6 : 5} className="px-3 py-8 text-center text-slate-500">
              No tasks found.
            </td>
          </tr>
        ) : (
          tasks.map((task) => {
            const owner = typeof task.createdBy === "string" ? "-" : task.createdBy.name;
            return (
              <tr key={task._id} className="border-t border-slate-100">
                <td className="px-3 py-3">
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <p className="text-xs text-slate-500">{task.description || "-"}</p>
                </td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">{task.status}</span>
                </td>
                <td className="px-3 py-3">
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">{task.priority}</span>
                </td>
                <td className="px-3 py-3">{formatDate(task.dueDate)}</td>
                {canSeeOwner ? <td className="px-3 py-3">{owner}</td> : null}
                <td className="px-3 py-3 text-right">
                  <button className="text-blue-600 hover:underline mr-3" onClick={() => onEdit(task)}>
                    Edit
                  </button>
                  <button className="text-red-600 hover:underline" onClick={() => void onDelete(task._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);
