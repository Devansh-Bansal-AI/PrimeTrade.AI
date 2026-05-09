import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authApi } from "../api/authApi";
import { Alert } from "../components/Alert";
import { FormInput } from "../components/FormInput";
import { useAuth } from "../hooks/useAuth";
import { getApiErrorMessage } from "../utils/apiError";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export const RegisterPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<RegisterForm>();

  return (
    <>
      {error ? <Alert tone="error" message={error} /> : null}
      <form
        onSubmit={handleSubmit(async (values) => {
          setLoading(true);
          setError(null);
          try {
            const payload = await authApi.register(values);
            login(payload);
            navigate("/dashboard");
          } catch (requestError: unknown) {
            setError(getApiErrorMessage(requestError, "Registration failed."));
          } finally {
            setLoading(false);
          }
        })}
      >
        <FormInput
          label="Name"
          autoComplete="name"
          error={formState.errors.name?.message}
          {...register("name", { required: "Name is required", minLength: 2 })}
        />
        <FormInput
          label="Email"
          type="email"
          autoComplete="email"
          error={formState.errors.email?.message}
          {...register("email", { required: "Email is required" })}
        />
        <FormInput
          label="Password"
          type="password"
          autoComplete="new-password"
          error={formState.errors.password?.message}
          {...register("password", { required: "Password is required", minLength: 8 })}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already registered?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
};
