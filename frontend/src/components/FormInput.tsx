import { forwardRef } from "react";

type FormInputProps = {
  label: string;
  type?: string;
  error?: string;
  [key: string]: unknown;
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, type = "text", error, ...props }, ref) => (
    <label className="block mb-4">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        ref={ref}
        type={type}
        className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm outline-none ${
          error ? "border-red-400 focus:ring-2 focus:ring-red-200" : "border-slate-300 focus:ring-2 focus:ring-blue-200"
        }`}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  )
);
FormInput.displayName = "FormInput";
