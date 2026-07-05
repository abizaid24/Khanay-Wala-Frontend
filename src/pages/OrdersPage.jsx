import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Receipt } from "lucide-react";
import { getMyOrders } from "../lib/services/orderService";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Spinner } from "../components/ui/Spinner";
import { EmptyState } from "../components/shared/EmptyState";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "../constants/roles";
import { formatPKR } from "../lib/utils";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream-50">Your orders</h1>

      {isLoading && <Spinner label="Loading orders" className="mt-10" />}

      {!isLoading && orders.length === 0 && (
        <EmptyState
          icon={Receipt}
          title="No orders yet"
          body="Once you place an order, it'll show up here with live status."
          className="mt-8"
        />
      )}

      {!isLoading && orders.length > 0 && (
        <div className="mt-8 flex flex-col gap-3">
          {orders.map((order) => (
            <Link key={order.id} to={`/orders/${order.id}`}>
              <Card className="flex items-center justify-between gap-4 p-5 transition-colors hover:border-saffron-300">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-400">
                    <span>#{order.id.slice(0, 8)}</span>
                    <span>{new Date(order.created_at).toLocaleDateString("en-PK")}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink-700 dark:text-cream-200">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} · {formatPKR(order.total_amount)}
                  </p>
                </div>
                <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
