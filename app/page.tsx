import "react-toastify/dist/ReactToastify.css";
import Chatbox from "@/components/Chatbox";
import Toast from "@/components/Toast";
import Tutor from "@/components/Tutor";

const Page = () => {
  return (
    <main className="flex min-h-screen">
      <Toast />
      <Chatbox />
      <Tutor />
    </main>
  );
}

export default Page