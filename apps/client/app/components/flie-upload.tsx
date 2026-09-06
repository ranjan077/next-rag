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
      className="flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-lg border-2 border-slate-700 bg-slate-900 p-4 text-white shadow-2xl hover:border-slate-500 md:flex-col md:gap-3 md:py-8"
      onClick={handleFileUpload}
    >
      <Upload className="h-5 w-5 shrink-0" />
      <h3 className="text-base font-semibold sm:text-lg">Upload PDF File</h3>
    </button>
  );
}
