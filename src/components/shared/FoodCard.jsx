import { Link } from "react-router-dom";
import { Plus, Store } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { formatPKR } from "../../lib/utils";

export function FoodCard({ item, onAdd, adding }) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div>
        <h3 className="font-semibold text-ink-900 dark:text-cream-50">{item.name}</h3>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm text-ink-600 dark:text-ink-200">{item.description}</p>
        )}
        <p className="mt-2 font-mono text-sm font-semibold text-saffron-600 dark:text-saffron-400">
          {formatPKR(item.price)}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Link
          to={`/restaurants/${item.restaurant_id}`}
          className="flex items-center gap-1.5 text-xs font-medium text-ink-500 hover:text-saffron-600 dark:text-ink-300"
        >
          <Store className="size-3.5" /> View restaurant
        </Link>
        <Button
          size="sm"
          variant={item.is_available ? "primary" : "secondary"}
          disabled={!item.is_available}
          loading={adding}
          onClick={() => onAdd?.(item.id)}
          className="gap-1"
        >
          <Plus className="size-4" /> {item.is_available ? "Add" : "Sold out"}
        </Button>
      </div>
    </Card>
  );
}
