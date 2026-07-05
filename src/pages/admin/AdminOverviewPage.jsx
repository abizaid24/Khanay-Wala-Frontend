import { useCallback, useEffect, useState } from "react";
import { Check, Info, MapPin, Phone, ShieldCheck } from "lucide-react";
import { approveRestaurant, getPendingRestaurants } from "../../lib/services/restaurantService";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/shared/EmptyState";
import { StatCard } from "../../components/shared/StatCard";
import { apiErrorMessage } from "../../lib/api";

export default function AdminOverviewPage() {
  const [pending, setPending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError("");
    getPendingRestaurants()
      .then(setPending)
      .catch((err) => setError(apiErrorMessage(err, "Couldn't load pending restaurants.")))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    setBusyId(id);
    try {
      await approveRestaurant(id);
      load();
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't approve this restaurant."));
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-500 dark:bg-saffron-500/15">
          <ShieldCheck className="size-5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream-50">Admin</h1>
          <p className="text-sm text-ink-600 dark:text-ink-200">Restaurant approvals</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard icon={ShieldCheck} label="Pending approval" value={isLoading ? "…" : pending.length} tone="saffron" />
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl border border-dashed border-ink-900/10 p-4 text-sm text-ink-600 dark:border-cream-100/10 dark:text-ink-200">
        <Info className="mt-0.5 size-4 shrink-0 text-saffron-500" />
        <p>
          This admin panel only wires up what your backend currently exposes for admins —
          restaurant approvals. Platform-wide user management and cross-restaurant analytics
          would need their own endpoints; I haven't built a UI for those since they don't
          exist yet, rather than fake it.
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-500">Awaiting approval</h2>

        {isLoading ? (
          <Spinner label="Loading pending restaurants" className="py-16" />
        ) : error ? (
          <EmptyState icon={ShieldCheck} title="Couldn't load" body={error} />
        ) : pending.length === 0 ? (
          <EmptyState icon={Check} title="All caught up" body="No restaurants are waiting for approval right now." />
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((r) => (
              <Card key={r.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-ink-900 dark:text-cream-50">{r.name}</h3>
                    <Badge tone="saffron">Pending</Badge>
                  </div>
                  {r.description && <p className="mt-1 line-clamp-1 text-sm text-ink-600 dark:text-ink-200">{r.description}</p>}
                  <div className="mt-2 flex flex-wrap gap-4 text-xs text-ink-500 dark:text-ink-300">
                    <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {r.address}</span>
                    {r.phone && <span className="flex items-center gap-1"><Phone className="size-3.5" /> {r.phone}</span>}
                  </div>
                </div>
                <Button size="sm" className="gap-1.5" loading={busyId === r.id} onClick={() => handleApprove(r.id)}>
                  <Check className="size-4" /> Approve
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
