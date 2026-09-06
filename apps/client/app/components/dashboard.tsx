import React from "react";
import FileUpload from "./flie-upload";
import Chat from "./chat";

export default function Dashboard({ role = "" }) {
  const isAdmin = role === "admin";

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      {isAdmin && (
        <aside className="shrink-0 border-b border-border bg-sidebar p-3 md:w-64 md:overflow-y-auto md:border-r md:border-b-0 md:p-4 lg:w-72">
          <h2 className="mb-3 px-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Knowledge base
          </h2>
          <FileUpload />
        </aside>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Chat />
      </div>
    </div>
  );
}
