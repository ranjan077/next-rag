import React from "react";
import FileUpload from "./flie-upload";
import Chat from "./chat";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-screen ">
      <div className="w-[30vw] border flex justify-center items-center">
        <FileUpload />
      </div>
      <div className="w-[70vw] border">
        <Chat />
      </div>
    </div>
  );
}
