"use client";

import { Upload } from "lucide-react";

export default function FileUpload() {
  const handleFileUpload = async () => {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = ".pdf";
    el.addEventListener("change", async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const formData = new FormData();
        formData.append("pdf", file);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload/pdf`,
          {
            method: "POST",
            body: formData,
          },
        );
        if (res.ok) {
          const data = await res.text();
          console.log(data); // Log the response from the server
        } else {
          alert("File upload failed.");
        }
      }
    });
    el.click();
  };

  return (
    <button
      type="button"
      className="group flex w-full cursor-pointer flex-row items-center gap-3 rounded-xl border-2 border-dashed border-border bg-card p-3 text-left transition-colors hover:border-primary/50 hover:bg-accent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none md:flex-col md:items-center md:gap-2 md:p-6 md:text-center"
      onClick={handleFileUpload}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Upload className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-card-foreground">
          Upload PDF
        </span>
        <span className="block text-xs text-muted-foreground">
          Click to choose a file
        </span>
      </span>
    </button>
  );
}
