"use client";

import { useState } from "react";
import { Toast } from "@base-ui/react/toast";
import { LoaderCircle, Upload } from "lucide-react";

export default function FileUpload() {
  const toastManager = Toast.useToastManager();
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setIsUploading(true);

    // timeout 0 keeps it on screen until we swap in the result below.
    const toastId = toastManager.add({
      title: "Uploading",
      description: file.name,
      type: "loading",
      timeout: 0,
    });

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/pdf`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        // The API answers in plain text, so surface its reason when it fits.
        const reason = await res.text().catch(() => "");
        throw new Error(reason.trim() || `Server responded ${res.status}`);
      }

      // Re-adding with the same id replaces the toast and restarts its timer.
      toastManager.add({
        id: toastId,
        title: "Upload complete",
        description: `${file.name} is being indexed and will be searchable shortly.`,
        type: "success",
        timeout: 6000,
      });
    } catch (error) {
      console.error("pdf upload failed:", error);

      toastManager.add({
        id: toastId,
        title: "Upload failed",
        description:
          error instanceof Error && error.message
            ? `${file.name} — ${error.message}`
            : `Couldn't upload ${file.name}. Please try again.`,
        type: "error",
        timeout: 8000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = () => {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = ".pdf";
    el.addEventListener("change", (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        void uploadFile(file);
      }
    });
    el.click();
  };

  return (
    <button
      type="button"
      disabled={isUploading}
      className="group flex w-full cursor-pointer flex-row items-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-3 text-left transition-colors hover:border-primary/50 hover:bg-accent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border disabled:hover:bg-card md:flex-col md:items-center md:gap-2 md:p-6 md:text-center"
      onClick={handleFileUpload}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-disabled:bg-accent group-disabled:text-accent-foreground">
        {isUploading ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-card-foreground">
          {isUploading ? "Uploading..." : "Upload PDF"}
        </span>
        <span className="block text-xs text-muted-foreground">
          {isUploading ? "Please wait" : "Click to choose a file"}
        </span>
      </span>
    </button>
  );
}
