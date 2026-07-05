import { Link } from "react-router-dom";
import { Store } from "lucide-react";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurants/${restaurant.id}`}>
      <Card className="group h-full overflow-hidden p-0 transition-transform duration-200 hover:-translate-y-1">
        <div className="flex h-36 items-center justify-center bg-gradient-to-br from-saffron-100 to-saffron-50 dark:from-ink-700 dark:to-ink-800">
          <Store className="size-10 text-saffron-500/70" />
        </div>
        <div className="flex flex-col gap-2 p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-ink-900 dark:text-cream-50">{restaurant.name}</h3>
            {restaurant.is_active === false && <Badge tone="paprika">Closed</Badge>}
          </div>
          <p className="line-clamp-1 text-sm text-ink-600 dark:text-ink-200">{restaurant.address}</p>
        </div>
      </Card>
    </Link>
  );
}
