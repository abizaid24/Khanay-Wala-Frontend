import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Pencil,
  Plus,
  Receipt,
  Settings,
  Store,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { getRestaurant } from "../../lib/services/restaurantService";
import {
  createFoodItem,
  deleteFoodItem,
  getMenu,
  updateFoodItem,
} from "../../lib/services/foodService";
import { getRestaurantOrders, updateOrderStatus } from "../../lib/services/orderService";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/shared/EmptyState";
import { ImageUpload } from "../../components/shared/ImageUpload";
import { StatCard } from "../../components/shared/StatCard";
import { SimpleBarChart } from "../../components/shared/SimpleBarChart";
import {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_SEQUENCE,
  ORDER_STATUS_TONE,
} from "../../constants/roles";
import { formatPKR, cn } from "../../lib/utils";
import { apiErrorMessage } from "../../lib/api";

const TABS = [
  { key: "menu", label: "Menu", icon: UtensilsCrossed },
  { key: "orders", label: "Orders", icon: Receipt },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

const EMPTY_ITEM = { name: "", description: "", price: "", image_url: null, is_available: true };

function MenuItemForm({ initial, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState(initial || EMPTY_ITEM);
  const change = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: field === "is_available" ? e.target.checked : e.target.value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...form, price: Number(form.price) });
      }}
      className="flex flex-col gap-3"
    >
      <ImageUpload value={form.image_url} onChange={(url) => setForm((f) => ({ ...f, image_url: url }))} />
      <Input label="Dish name" required value={form.name} onChange={change("name")} placeholder="e.g. Chicken Karahi" />
      <Textarea label="Description" value={form.description} onChange={change("description")} rows={2} placeholder="Short, tasty description" />
      <Input label="Price (PKR)" type="number" min="0" step="1" required value={form.price} onChange={change("price")} />
      <label className="flex items-center gap-2 text-sm font-medium text-ink-700 dark:text-cream-200">
        <input type="checkbox" checked={!!form.is_available} onChange={change("is_available")} className="size-4 accent-saffron-500" />
        Available right now
      </label>
      <div className="flex gap-2">
        <Button type="submit" size="sm" loading={saving}>Save</Button>
        <Button type="button" size="sm" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}

function MenuTab({ restaurantId }) {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    setIsLoading(true);
    getMenu(restaurantId)
      .then(setMenu)
      .catch((err) => setError(apiErrorMessage(err, "Couldn't load your menu.")))
      .finally(() => setIsLoading(false));
  }, [restaurantId]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (values) => {
    setBusyId("new");
    setError("");
    try {
      await createFoodItem(restaurantId, values);
      setAdding(false);
      load();
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't add that dish."));
    } finally {
      setBusyId(null);
    }
  };

  const handleUpdate = async (itemId, values) => {
    setBusyId(itemId);
    setError("");
    try {
      await updateFoodItem(itemId, values);
      setEditingId(null);
      load();
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't update that dish."));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (itemId) => {
    setBusyId(itemId);
    setError("");
    try {
      await deleteFoodItem(itemId);
      load();
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't remove that dish."));
      setBusyId(null);
    }
  };

  if (isLoading) return <Spinner label="Loading menu" className="py-16" />;

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="rounded-2xl bg-paprika-500/10 px-4 py-3 text-sm font-medium text-paprika-500">{error}</p>}

      {!adding && (
        <Button size="sm" className="w-fit gap-1.5" onClick={() => setAdding(true)}>
          <Plus className="size-4" /> Add dish
        </Button>
      )}
      {adding && (
        <Card className="p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">New dish</h3>
          <MenuItemForm onSubmit={handleCreate} onCancel={() => setAdding(false)} saving={busyId === "new"} />
        </Card>
      )}

      {menu.length === 0 && !adding ? (
        <EmptyState icon={UtensilsCrossed} title="No dishes yet" body="Add your first menu item so customers can order it." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {menu.map((item) =>
            editingId === item.id ? (
              <Card key={item.id} className="p-5">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-500">Edit dish</h3>
                <MenuItemForm
                  initial={{ name: item.name, description: item.description || "", price: item.price, image_url: item.image_url || null, is_available: item.is_available }}
                  onSubmit={(values) => handleUpdate(item.id, values)}
                  onCancel={() => setEditingId(null)}
                  saving={busyId === item.id}
                />
              </Card>
            ) : (
              <Card key={item.id} className="flex flex-col gap-3 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 gap-3">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="size-14 shrink-0 rounded-xl object-cover border border-ink-900/10 dark:border-cream-100/10"
                      />
                    )}
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-ink-900 dark:text-cream-50">{item.name}</h3>
                      {item.description && <p className="mt-0.5 line-clamp-2 text-sm text-ink-600 dark:text-ink-200">{item.description}</p>}
                      <p className="mt-1.5 font-mono text-sm font-semibold text-saffron-600 dark:text-saffron-400">{formatPKR(item.price)}</p>
                    </div>
                  </div>
                  <Badge tone={item.is_available ? "cardamom" : "neutral"}>{item.is_available ? "Available" : "Unavailable"}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => setEditingId(item.id)}>
                    <Pencil className="size-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="secondary" className="gap-1.5" loading={busyId === item.id} onClick={() => handleDelete(item.id)}>
                    <Trash2 className="size-3.5" /> Delete
                  </Button>
                </div>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}

const NEXT_STATUS = {
  [ORDER_STATUS.PENDING]: ORDER_STATUS.PREPARING,
  [ORDER_STATUS.PREPARING]: ORDER_STATUS.OUT_FOR_DELIVERY,
  [ORDER_STATUS.OUT_FOR_DELIVERY]: ORDER_STATUS.DELIVERED,
};

function OrdersTab({ orders, isLoading, error: loadError, reload }) {
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const advance = async (order) => {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    setBusyId(order.id);
    setError("");
    try {
      await updateOrderStatus(order.id, next);
      reload();
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't update order status."));
    } finally {
      setBusyId(null);
    }
  };

  const cancel = async (order) => {
    setBusyId(order.id);
    setError("");
    try {
      await updateOrderStatus(order.id, ORDER_STATUS.CANCELLED);
      reload();
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't cancel this order."));
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) return <Spinner label="Loading orders" className="py-16" />;
  if (loadError) return <p className="rounded-2xl bg-paprika-500/10 px-4 py-3 text-sm font-medium text-paprika-500">{loadError}</p>;
  if (orders.length === 0) {
    return <EmptyState icon={Receipt} title="No orders yet" body="Incoming orders for this restaurant will show up here." />;
  }

  const sorted = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="rounded-2xl bg-paprika-500/10 px-4 py-3 text-sm font-medium text-paprika-500">{error}</p>}
      {sorted.map((order) => {
        const next = NEXT_STATUS[order.status];
        const canCancel = order.status === ORDER_STATUS.PENDING;
        return (
          <Card key={order.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-mono text-sm font-semibold text-ink-900 dark:text-cream-50">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-xs text-ink-500 dark:text-ink-300">
                  {new Date(order.created_at).toLocaleString("en-PK")}
                </p>
              </div>
              <Badge tone={ORDER_STATUS_TONE[order.status]}>{ORDER_STATUS_LABELS[order.status]}</Badge>
            </div>

            <div className="kot-divider my-4" />

            <ul className="flex flex-col gap-1 font-mono text-sm text-ink-800 dark:text-cream-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.quantity}× {item.food_name}</span>
                  <span>{formatPKR(item.price_at_order * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-sm font-semibold text-ink-900 dark:text-cream-50">
                Total {formatPKR(order.total_amount)}
              </span>
              <div className="flex gap-2">
                {canCancel && (
                  <Button size="sm" variant="secondary" loading={busyId === order.id} onClick={() => cancel(order)}>
                    Cancel order
                  </Button>
                )}
                {next && (
                  <Button size="sm" loading={busyId === order.id} onClick={() => advance(order)}>
                    Mark {ORDER_STATUS_LABELS[next].toLowerCase()}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function AnalyticsTab({ orders }) {
  const stats = useMemo(() => {
    const delivered = orders.filter((o) => o.status === ORDER_STATUS.DELIVERED);
    const cancelled = orders.filter((o) => o.status === ORDER_STATUS.CANCELLED);
    const revenue = delivered.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    const byStatus = ORDER_STATUS_SEQUENCE.concat(ORDER_STATUS.CANCELLED).map((status) => ({
      label: ORDER_STATUS_LABELS[status],
      value: orders.filter((o) => o.status === status).length,
    }));

    // Last 7 calendar days, order counts per day, from real order timestamps.
    const days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    const byDay = days.map((d) => {
      const key = d.toDateString();
      const count = orders.filter((o) => new Date(o.created_at).toDateString() === key).length;
      return { label: d.toLocaleDateString("en-PK", { weekday: "short" }), value: count };
    });

    return { total: orders.length, delivered: delivered.length, cancelled: cancelled.length, revenue, byStatus, byDay };
  }, [orders]);

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-ink-500 dark:text-ink-300">
        Computed live from this restaurant's real order history — nothing here is simulated.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Receipt} label="Total orders" value={stats.total} />
        <StatCard icon={BarChart3} label="Delivered" value={stats.delivered} tone="cardamom" />
        <StatCard icon={Receipt} label="Cancelled" value={stats.cancelled} tone="paprika" />
        <StatCard icon={BarChart3} label="Revenue (delivered)" value={formatPKR(stats.revenue)} />
      </div>

      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-500">Orders — last 7 days</h3>
        <SimpleBarChart data={stats.byDay} />
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-500">Orders by status</h3>
        <SimpleBarChart data={stats.byStatus} />
      </Card>
    </div>
  );
}

export default function RestaurantWorkspacePage() {
  const { id } = useParams();
  const [tab, setTab] = useState("menu");
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const loadOrders = useCallback(() => {
    setOrdersLoading(true);
    getRestaurantOrders(id)
      .then(setOrders)
      .catch((err) => setOrdersError(apiErrorMessage(err, "Couldn't load orders.")))
      .finally(() => setOrdersLoading(false));
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    getRestaurant(id)
      .then(setRestaurant)
      .catch((err) => setError(apiErrorMessage(err, "Couldn't load this restaurant.")))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  if (isLoading) return <Spinner label="Loading workspace" className="py-24" />;
  if (error || !restaurant) {
    return <EmptyState icon={Store} title="Restaurant unavailable" body={error} className="mx-auto my-16 max-w-md" />;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <Link to="/owner" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-saffron-600 dark:text-ink-300">
        <ArrowLeft className="size-4" /> Back to your restaurants
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream-50">{restaurant.name}</h1>
          <p className="text-sm text-ink-600 dark:text-ink-200">{restaurant.address}</p>
        </div>
        <Link to={`/owner/restaurants/${id}/edit`}>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <Settings className="size-3.5" /> Edit details
          </Button>
        </Link>
      </div>

      <div className="mt-8 flex gap-1 rounded-full bg-ink-900/5 p-1 dark:bg-cream-100/5 w-fit">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === key
                ? "bg-saffron-500 text-cream-50 shadow-soft"
                : "text-ink-600 hover:text-ink-900 dark:text-ink-200 dark:hover:text-cream-50"
            )}
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "menu" && <MenuTab restaurantId={id} />}
        {tab === "orders" && (
          <OrdersTab orders={orders} isLoading={ordersLoading} error={ordersError} reload={loadOrders} />
        )}
        {tab === "analytics" && <AnalyticsTab orders={orders} />}
      </div>
    </div>
  );
}