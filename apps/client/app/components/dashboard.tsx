import React from "react";
import FileUpload from "./flie-upload";
import Chat from "./chat";

export default function Dashboard({ role = "" }) {
  const isAdmin = role === "admin";

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      {isAdmin && (
        <aside className="shrink-0 border-b p-3 md:w-64 md:overflow-y-auto md:border-r md:border-b-0 lg:w-80">
          <FileUpload />
        </aside>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Chat />
      </div>
    </div>
  );
}
