import Image from "next/image";
import FileUpload from "./components/flie-upload";
import Chat from "./components/chat";

export default function Home() {
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
