import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/shared/EmptyState";
import { Spinner } from "../components/ui/Spinner";
import { formatPKR } from "../lib/utils";
import { apiErrorMessage } from "../lib/api";

export default function CartPage() {
  const { cart, isLoading, updateItemQuantity, removeItem, emptyCart } = useCart();
  const navigate = useNavigate();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const runAction = async (id, action) => {
    setBusyId(id);
    setError("");
    try {
      await action();
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't update your cart."));
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) return <Spinner label="Loading your cart" className="py-24" />;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-2xl font-semibold text-ink-900 dark:text-cream-50">Your cart</h1>

      {error && (
        <p className="mt-4 rounded-2xl bg-paprika-500/10 px-4 py-3 text-sm font-medium text-paprika-500">{error}</p>
      )}

      {cart.items.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          body="Add something delicious from a restaurant to get started."
          action={
            <Link to="/restaurants">
              <Button className="mt-2">Browse restaurants</Button>
            </Link>
          }
          className="mt-8"
        />
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-3">
            {cart.items.map((item) => (
              <Card key={item.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <h3 className="font-medium text-ink-900 dark:text-cream-50">{item.food_name}</h3>
                  <p className="font-mono text-sm text-ink-500 dark:text-ink-200">{formatPKR(item.unit_price)} each</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-ink-900/10 px-2 py-1 dark:border-cream-100/10">
                    <button
                      disabled={busyId === item.id || item.quantity <= 1}
                      onClick={() => runAction(item.id, () => updateItemQuantity(item.id, item.quantity - 1))}
                      className="flex size-7 items-center justify-center rounded-full text-ink-600 hover:bg-ink-900/5 disabled:opacity-40 dark:text-cream-200 dark:hover:bg-cream-100/10"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      disabled={busyId === item.id}
                      onClick={() => runAction(item.id, () => updateItemQuantity(item.id, item.quantity + 1))}
                      className="flex size-7 items-center justify-center rounded-full text-ink-600 hover:bg-ink-900/5 disabled:opacity-40 dark:text-cream-200 dark:hover:bg-cream-100/10"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  <p className="w-20 text-right font-mono text-sm font-semibold text-ink-900 dark:text-cream-50">
                    {formatPKR(item.subtotal)}
                  </p>

                  <button
                    disabled={busyId === item.id}
                    onClick={() => runAction(item.id, () => removeItem(item.id))}
                    className="flex size-8 items-center justify-center rounded-full text-ink-400 hover:bg-paprika-500/10 hover:text-paprika-500"
                    aria-label="Remove item"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-6 flex items-center justify-between p-5">
            <button
              onClick={() => runAction("all", emptyCart)}
              className="text-sm font-medium text-ink-500 hover:text-paprika-500 dark:text-ink-200"
            >
              Clear cart
            </button>
            <div className="flex items-center gap-4">
              <span className="text-sm text-ink-600 dark:text-ink-200">Total</span>
              <span className="font-mono text-lg font-semibold text-ink-900 dark:text-cream-50">
                {formatPKR(cart.total)}
              </span>
            </div>
          </Card>

          <Button size="lg" className="mt-6 w-full" onClick={() => navigate("/checkout")}>
            Proceed to checkout
          </Button>
        </>
      )}
    </div>
  );
}
