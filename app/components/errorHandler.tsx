import { useRouter } from "next/navigation";

export default function Error({ Message }: { Message: { info: string; details: string } }) {
  const Router = useRouter();
  const redirect = () => {
    Router.push("/");
  };
  return (
    <div className="flex w-screen bg-black text-white justify-center items-center h-screen font-bold flex-col">
      <div className="text-center">
        <p className="text-5xl text-red-500 pb-4">Opps, An error occurred</p>
        <p className="text-3xl pb-1">{Message.info}</p>
        <p className="text-2xl pb-1 text-cyan-600">{Message.details}</p>
        <p className="text-xl pb-1 mt-5">Please try refreshing this page</p>

        <button
          className="inline-block px-16 py-3 mt-2 bg-[#e41f18] border-white text-white font-thin text-lg leading-snug  rounded-full"
          onClick={redirect}
        >
          Refresh
        </button>
        <p className="font-light mt-8">If the issue still persists please contact me at:</p>
        <a className="text-xl text-white hover:text-cyan-400" href="mailto:contact@jawadnozari.com?subject=Issue when showing Table">
          contact@jawadnozari.com
        </a>
      </div>
    </div>
  );
}
