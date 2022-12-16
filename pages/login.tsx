import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import Bemanningsplan from "./bemanningsplan";
const Login: NextPage = () => {
  //TODO: change useState to something Efficient
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function handleSubmit(event: any) {
    event.preventDefault();

    const body = {
      userName: username,
      password: password,
    };

    const config = {
      url: "/api/getCredential",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(body),
    };
    let response = await axios(config)
      .then((res) => {
        setError(false);
        return { data: res.data, success: res.status == 200 ? true : false };
      })
      .catch((err) => {
        setMessage(err.message);
        setError(true);
        return err;
      });
    return response;
  }

  return (
    <div className="flex flex-col justify-between items-center h-screen bg-slate-700">
      <div className="flex justify-between grow items-center">
        <form className=" border rounded-2xl border-gray-700 max-w-10 bg-gray-900 py-10 px-10 ">
          <div className="flex items-center justify-center mt-2">
            <Image src="https://www.max.se/build/svg/logo-max.svg" alt="Max logo" width={150} height={150} />
          </div>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-3 min-w-[300px]">
              <div className="flex flex-col">
                <p className="text-white pb-1">Username</p>
                <input
                  type="text"
                  className="block w-full px-3 py-2 text-lg font-normal text-white bg-clip-padding border border-solid border-gray-600 rounded-lg bg-gray-800 focus:outline-none"
                  id="username"
                  placeholder="ab1234"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-white pb-1">Password</p>
                <input
                  type="password"
                  className="block w-full px-3 py-2 text-lg font-normal text-white bg-clip-padding border border-solid border-gray-600 rounded-lg bg-gray-800 focus:outline-none"
                  id="password"
                  placeholder="Max1234"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-center text-center lg:text-left">
              <button
                type="submit"
                className="inline-block px-16 py-3 bg-[#e41f18] border-white text-white font-medium text-sm leading-snug uppercase rounded-full"
                onClick={handleSubmit}
              >
                Login
              </button>
            </div>
            <div className={`flex flex-col  justify-center text-center text-red-600 ${!error ? "hidden" : ""}`}>{message}</div>
          </div>
        </form>
      </div>

      <div className="">
        <div className="block text-center text-sm max-w-xs my-2 text-white">
          <p className="text-red-400 font-extrabold">Warning!</p>
          <p> This page is still in development and is not yet fully functional Please Contact me at: </p>
          <> contact@jawadnozari.com</>
          <p> if you find any issue</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
