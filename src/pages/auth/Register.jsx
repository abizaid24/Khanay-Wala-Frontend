import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { apiErrorMessage } from "../../lib/api";
import { REGISTERABLE_ROLES, ROLES } from "../../constants/roles";
import { cn } from "../../lib/utils";

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    role: ROLES.CUSTOMER,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      await login({ email: form.email, password: form.password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, "Could not create your account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="mb-7 flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream-50">Apna account banayein</h1>
        <p className="text-sm text-ink-600 dark:text-ink-200">Join KhanayWala in under a minute.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2">
          {REGISTERABLE_ROLES.map((r) => (
            <button
              type="button"
              key={r.value}
              onClick={() => setForm((f) => ({ ...f, role: r.value }))}
              className={cn(
                "rounded-2xl border px-3 py-2.5 text-left text-sm transition-colors",
                form.role === r.value
                  ? "border-saffron-500 bg-saffron-50 text-ink-900 dark:bg-saffron-500/15 dark:text-cream-50"
                  : "border-ink-900/10 text-ink-600 hover:border-ink-900/20 dark:border-cream-100/10 dark:text-ink-200"
              )}
            >
              <span className="block font-semibold">{r.label}</span>
              <span className="block text-xs opacity-80">{r.hint}</span>
            </button>
          ))}
        </div>

        <Input
          label="Full name"
          name="full_name"
          required
          value={form.full_name}
          onChange={handleChange}
          placeholder="Ali Raza"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <Input
          label="Phone (optional)"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="03xx-xxxxxxx"
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
        />
        {error && <p className="text-sm font-medium text-paprika-500">{error}</p>}
        <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-200">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-saffron-600 dark:text-saffron-400">
          Log in
        </Link>
      </p>
    </Card>
  );
}
