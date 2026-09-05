"use client";

import { Upload } from "lucide-react";

export default function FileUpload() {
  const handleFileUpload = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = document.createElement("input");
    el.type = "file";
    el.accept = ".pdf";
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
