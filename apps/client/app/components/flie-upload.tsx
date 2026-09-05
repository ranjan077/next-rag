"use client";

import { Upload } from "lucide-react";

export default function FileUpload() {
  const handleFileUpload = async (event: React.MouseEvent<HTMLDivElement>) => {
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
          `${process.env.NEXT_PUBLIC_SERVER_URL}/upload/pdf`,
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
    <div
      className="bg-slate-900 text-white shadow-2xl flex flex-col justify-center items-center rounded-lg w-screen p-4 m-2 border-2 border-slate-700 hover:border-slate-500 pointer"
      onClick={handleFileUpload}
    >
      <h3 className="text-lg font-semibold p-2">Upload PDF File</h3>
      <Upload></Upload>
    </div>
  );
}
