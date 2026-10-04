type AuthFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function AuthField({ label, error, ...props }: AuthFieldProps) {
  return (
    <label className="block text-left">
      <span className="mb-2 block text-xs uppercase tracking-wider text-black/50">
        {label}
      </span>
      <input
        {...props}
        aria-invalid={Boolean(error)}
        className={`h-12 w-full rounded-lg border bg-transparent px-3 outline-none focus:border-black ${
          error ? "border-red-400" : "border-black/15"
        }`}
      />
      {error && (
        <span className="mt-1.5 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}