import Loader from "./components/Loader";
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <div className="flex h-screen w-screen items-center bg-black justify-center">
        <div className="flex">
          <div className="border-4 border-solid border-white rounded-full border-t-4 border-t-black w-5 h-5 animate-spin"></div>
          <div className="ml-2 text-white">Loading</div>
        </div>
      </div>
    </>
  );
}
