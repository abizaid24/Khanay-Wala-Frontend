import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { checkout } from "../lib/services/orderService";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/shared/EmptyState";
import { formatPKR } from "../lib/utils";
import { apiErrorMessage } from "../lib/api";

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ delivery_address: "", notes: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const order = await checkout({
        delivery_address: form.delivery_address,
        notes: form.notes || undefined,
      });
      await refreshCart();
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't place your order."));
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Nothing to check out"
        body="Your cart is empty — add something first."
        action={
          <Link to="/restaurants">
            <Button className="mt-2">Browse restaurants</Button>
          </Link>
        }
        className="mx-auto my-20 max-w-md"
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream-50">Checkout</h1>

      <Card className="mt-6 p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-500 dark:text-ink-200">
          Order summary
        </h2>
        <ul className="flex flex-col gap-2 font-mono text-sm text-ink-800 dark:text-cream-100">
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.quantity}× {item.food_name}</span>
              <span>{formatPKR(item.subtotal)}</span>
            </li>
          ))}
        </ul>
        <div className="kot-divider my-4" />
        <div className="flex justify-between font-mono text-sm font-semibold text-ink-900 dark:text-cream-50">
          <span>Total</span>
          <span>{formatPKR(cart.total)}</span>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Input
          label="Delivery address"
          name="delivery_address"
          required
          value={form.delivery_address}
          onChange={handleChange}
          placeholder="House 12, Street 4, DHA Phase 5, Lahore"
        />
        <Textarea
          label="Notes for the restaurant (optional)"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="e.g. Kam mirch, extra raita"
        />
        {error && <p className="text-sm font-medium text-paprika-500">{error}</p>}
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Place order · {formatPKR(cart.total)}
        </Button>
      </form>
    </div>
  );
}
