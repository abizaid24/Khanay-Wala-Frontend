import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { uploadImageToCloudinary } from "../../lib/cloudinary";
import { cn } from "../../lib/utils";

const MAX_SIZE_MB = 5;

export function ImageUpload({ value, onChange, label = "Dish photo" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setError("");
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onChange(url);
    } catch (err) {
      setError(err.message || "Couldn't upload that image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-ink-700 dark:text-cream-200">{label}</span>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="relative w-fit">
          <img
            src={value}
            alt="Dish preview"
            className="h-32 w-32 rounded-2xl object-cover border border-ink-900/10 dark:border-cream-100/10"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-ink-900 text-cream-50 shadow-soft hover:bg-ink-800"
            aria-label="Remove image"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex h-32 w-32 flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed",
            "border-ink-900/15 dark:border-cream-100/15 text-ink-500 dark:text-ink-300",
            "hover:border-saffron-500 hover:text-saffron-600 transition-colors disabled:opacity-60"
          )}
        >
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <ImagePlus className="size-5" />
          )}
          <span className="text-xs font-medium">{uploading ? "Uploading…" : "Add photo"}</span>
        </button>
      )}

      {error && <p className="text-xs font-medium text-paprika-500">{error}</p>}
    </div>
  );
}