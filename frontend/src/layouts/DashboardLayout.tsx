import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm ${isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-200"}`;

export const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Task Workspace</h1>
            <p className="text-xs text-slate-500">
              Signed in as {user?.name} ({user?.role})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/tasks" className={linkClass}>
              Tasks
            </NavLink>
            <button
              onClick={logout}
              className="px-3 py-2 rounded-md text-sm bg-red-600 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
