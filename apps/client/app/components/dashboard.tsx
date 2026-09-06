import React from "react";
import FileUpload from "./flie-upload";
import Chat from "./chat";

export default function Dashboard({ role = "" }) {
  const isAdmin = role === "admin";

  return (
    <div className="flex min-h-screen w-screen">
      {isAdmin && (
        <div className="w-[30vw] border flex justify-center items-center">
          <FileUpload />
        </div>
      )}

      <div className={isAdmin ? "w-[70vw] border" : "w-full border"}>
        <Chat />
      </div>
    </div>
  );
}
