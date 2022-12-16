import axios from "axios";
import Image from "next/image";
import type { NextPage } from "next";
import Button from "../components/customButton";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const CustomButton = () => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => successHandler(codeResponse),
    flow: "auth-code",
    scope: "https://www.googleapis.com/auth/calendar openid email profile",
  });
  return (
    <Button onClick={login} className="shadow border border-gray-300 font-bold py-1 pr-3 pl-1 rounded-full">
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
      return res.data;
    })
    .catch((err) => {
      return err.message;
    });
};

const Home: NextPage = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID_NOT_FOUND";
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
