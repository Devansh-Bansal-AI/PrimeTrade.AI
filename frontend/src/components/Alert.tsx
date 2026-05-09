type AlertProps = {
  tone: "success" | "error";
  message: string;
};

export const Alert = ({ tone, message }: AlertProps) => (
  <div
    className={`rounded-lg px-3 py-2 text-sm mb-4 ${
      tone === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
    }`}
  >
    {message}
  </div>
);
