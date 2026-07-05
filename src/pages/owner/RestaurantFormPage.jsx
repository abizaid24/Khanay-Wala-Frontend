import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Store } from "lucide-react";
import { createRestaurant, getRestaurant, updateRestaurant } from "../../lib/services/restaurantService";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/ui/Spinner";
import { apiErrorMessage } from "../../lib/api";

const EMPTY_FORM = { name: "", address: "", phone: "", description: "" };

export default function RestaurantFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getRestaurant(id)
      .then((r) => {
        setRestaurant(r);
        setForm({
          name: r.name || "",
          address: r.address || "",
          phone: r.phone || "",
          description: r.description || "",
        });
      })
      .catch((err) => setError(apiErrorMessage(err, "Couldn't load this restaurant.")))
      .finally(() => setIsLoading(false));
  }, [id, isEdit]);

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        phone: form.phone.trim() || undefined,
        description: form.description.trim() || undefined,
      };
      if (isEdit) {
        await updateRestaurant(id, payload);
        navigate(`/owner/restaurants/${id}`);
      } else {
        const created = await createRestaurant(payload);
        navigate(`/owner/restaurants/${created.id}`);
      }
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't save your restaurant."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!restaurant) return;
    setError("");
    setIsSaving(true);
    try {
      const updated = await updateRestaurant(id, { is_active: !restaurant.is_active });
      setRestaurant(updated);
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't update status."));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <Spinner label="Loading restaurant" className="py-24" />;

  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <Link to="/owner" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-saffron-600 dark:text-ink-300">
        <ArrowLeft className="size-4" /> Back to your restaurants
      </Link>

      <div className="flex items-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-500 dark:bg-saffron-500/15">
          <Store className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-ink-900 dark:text-cream-50">
            {isEdit ? "Edit restaurant" : "New restaurant"}
          </h1>
          {isEdit && restaurant && (
            <div className="mt-1 flex gap-1.5">
              {restaurant.is_approved === false ? (
                <Badge tone="saffron">Awaiting admin approval</Badge>
              ) : (
                <Badge tone="cardamom">Approved</Badge>
              )}
              <Badge tone={restaurant.is_active === false ? "paprika" : "neutral"}>
                {restaurant.is_active === false ? "Inactive" : "Active"}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {!isEdit && (
        <p className="mt-3 text-sm text-ink-600 dark:text-ink-200">
          New restaurants start pending — an admin needs to approve it before it shows up in
          customer search.
        </p>
      )}

      <Card className="mt-6 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Restaurant name" required value={form.name} onChange={handleChange("name")} placeholder="e.g. Lahori Karahi House" />
          <Input label="Address" required value={form.address} onChange={handleChange("address")} placeholder="Street, area, city" />
          <Input label="Phone" value={form.phone} onChange={handleChange("phone")} placeholder="03xx-xxxxxxx" />
          <Textarea label="Description" value={form.description} onChange={handleChange("description")} placeholder="What makes your food worth ordering?" rows={4} />

          {error && <p className="text-sm font-medium text-paprika-500">{error}</p>}

          <div className="mt-2 flex flex-wrap gap-3">
            <Button type="submit" loading={isSaving}>
              {isEdit ? "Save changes" : "Create restaurant"}
            </Button>
            {isEdit && restaurant && (
              <Button type="button" variant="secondary" loading={isSaving} onClick={handleToggleActive}>
                {restaurant.is_active === false ? "Mark as active" : "Mark as temporarily closed"}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
