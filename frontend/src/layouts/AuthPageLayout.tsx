import { Link, Outlet } from "react-router-dom";

export const AuthPageLayout = () => (
  <div className="min-h-screen bg-slate-100 grid place-items-center p-4">
    <div className="w-full max-w-md rounded-xl bg-white border border-slate-200 p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Task Workspace</h1>
      <p className="mt-1 text-sm text-slate-600">
        Secure task platform with role-based access.
      </p>
      <div className="mt-6">
        <Outlet />
      </div>
      <p className="mt-6 text-xs text-slate-500">
        Need API docs? Open{" "}
        <a href="http://localhost:5000/api-docs" className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
          Swagger UI
        </a>
        .
      </p>
      <p className="mt-2 text-xs text-slate-500">
        Demo route:{" "}
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          Dashboard
        </Link>
      </p>
    </div>
  </div>
);
