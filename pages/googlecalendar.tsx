import axios from "axios";
import Image from "next/image";
import type { NextPage } from "next";
import Button from "../components/customButton";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const CustomButton = () => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => successHandler(codeResponse),
    flow: "auth-code",
  });
  return (
    <Button
      onClick={login}
      className="shadow border border-gray-300 font-bold py-1 pr-3 pl-1 rounded-full"
    >
      <div className="flex flex-row items-center">
        <Image src="/Google.svg" alt="" width={30} height={30} />
        <div className="pl-2 font-Roboto font-normal">Sign in with Google</div>
      </div>
    </Button>
  );
};
const successHandler = (response: any) => {
  const { code } = response;
  axios
    .post("/api/googleCalendar", {
      code: code,
      grantType: "authorization_code",
    })
    .then((res) => {
      console.log("Response is: ", res.data);
    })
    .catch((err) => {
      console.log("Error is: ", err);
    });
};

const Home: NextPage = () => {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    "62211480534-v75u74rk776u5sfu5uoco7unr04md5bt.apps.googleusercontent.com";
  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        <div className="flex justify-center pt-4">
          <GoogleOAuthProvider clientId={clientId}>
            <CustomButton></CustomButton>
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
};

export default Home;
