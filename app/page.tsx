import "react-toastify/dist/ReactToastify.css";
import Chatbox from "@/components/Chatbox";
import Toast from "@/components/Toast";
import Tutor from "@/components/Tutor";

const Page = () => {
  return (
    <main className="flex h-screen w-screen items-center justify-center">
      <Toast />
      <Chatbox />
      <Tutor />
    </main>
  );
}

export default Page