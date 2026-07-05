import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Settings, Store, UtensilsCrossed } from "lucide-react";
import { getMyRestaurants } from "../../lib/services/restaurantService";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/shared/EmptyState";
import { apiErrorMessage } from "../../lib/api";

function StatusBadges({ restaurant }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {restaurant.is_approved === false && <Badge tone="saffron">Pending approval</Badge>}
      {restaurant.is_approved !== false && <Badge tone="cardamom">Approved</Badge>}
      {restaurant.is_active === false && <Badge tone="paprika">Inactive</Badge>}
    </div>
  );
}

export default function OwnerOverviewPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setIsLoading(true);
    setError("");
    getMyRestaurants()
      .then(setRestaurants)
      .catch((err) => setError(apiErrorMessage(err, "Couldn't load your restaurants.")))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream-50">Your restaurants</h1>
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-200">
            Manage menus, track incoming orders, and see how each place is doing.
          </p>
        </div>
        <Link to="/owner/restaurants/new">
          <Button className="gap-2">
            <Plus className="size-4" /> New restaurant
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Spinner label="Loading your restaurants" className="py-24" />
      ) : error ? (
        <EmptyState icon={Store} title="Couldn't load restaurants" body={error} className="mt-10" />
      ) : restaurants.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No restaurants yet"
          body="List your first restaurant to start receiving orders on KhanayWala."
          action={
            <Link to="/owner/restaurants/new">
              <Button className="mt-2 gap-2">
                <Plus className="size-4" /> Create your restaurant
              </Button>
            </Link>
          }
          className="mt-10"
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {restaurants.map((r) => (
            <Card key={r.id} className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-ink-900 dark:text-cream-50">{r.name}</h3>
                  <p className="mt-0.5 truncate text-sm text-ink-600 dark:text-ink-200">{r.address}</p>
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-500 dark:bg-saffron-500/15">
                  <Store className="size-4.5" />
                </span>
              </div>

              <StatusBadges restaurant={r} />

              <div className="mt-1 flex flex-wrap gap-2">
                <Link to={`/owner/restaurants/${r.id}`}>
                  <Button size="sm" className="gap-1.5">
                    <UtensilsCrossed className="size-3.5" /> Manage
                  </Button>
                </Link>
                <Link to={`/owner/restaurants/${r.id}/edit`}>
                  <Button size="sm" variant="secondary" className="gap-1.5">
                    <Settings className="size-3.5" /> Edit details
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
