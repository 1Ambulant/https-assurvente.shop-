import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { Upload, Check, Loader2, ImageIcon } from "lucide-react";
import { useAudio } from "../hooks/useAudio";

export default function ImageUploader({ productId, onUpload, className = "" }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const { play } = useAudio();

  const handleFile = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const options = {
        maxSizeMB: 0.08,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: "image/webp",
        alwaysKeepResolution: false,
      };
      const compressed = await imageCompression(file, options);
      setPreview(URL.createObjectURL(compressed));

      // Upload reel vers POST /api/vendor/piece-photo (backend FlashMecano,
      // verifie en production le 2026-08-26) : stockage Supabase Storage
      // reel, bucket "pieces-photos", authentifie par le token de session
      // vendeur. Retourne une URL publique reelle -- rien n'est simule.
      const token = localStorage.getItem("flashmecano_vendor_token");
      const formData = new FormData();
      formData.append("file", compressed, "piece.webp");
      const res = await fetch("/api/vendor/piece-photo", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.detail || "Echec de l'envoi de la photo");

      onUpload?.(data.url);
      play("success");
    } catch (err) {
      play("error");
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }, [productId, onUpload, play]);

  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
        id={`up-${productId || "generic"}`}
      />
      <label
        htmlFor={`up-${productId || "generic"}`}
        className="flex flex-col items-center justify-center w-full h-36 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 active:scale-[0.98] transition-all overflow-hidden"
      >
        {uploading ? (
          <Loader2 size={28} className="text-blue-600 animate-spin" />
        ) : preview ? (
          <div className="relative w-full h-full">
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Check size={32} className="text-white drop-shadow-lg" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageIcon size={28} />
            <span className="text-xs font-medium">Ajouter une photo</span>
            <span className="text-[10px] opacity-70">Auto-compression • Max 80KB</span>
          </div>
        )}
      </label>
    </div>
  );
}