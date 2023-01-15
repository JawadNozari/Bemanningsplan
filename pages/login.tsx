import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { NextPage } from "next";
import Cookies from "js-cookie";
import Router from "next/router";
import Loader from "../components/Loader";

const Login: NextPage = () => {
  //TODO: change useState to something Efficient
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(event: any) {
    event.preventDefault();
    setLoading(true);

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
        Cookies.set("SESSIONID", res.data[0].value, { expires: 1 / 24 });
        Router.replace("/");
        return { data: res.data, success: res.status == 200 ? true : false };
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.response.data);
        setError(true);
        setLoading(false);
        return err;
      });

    return response;
  }

  return (
    <div className="flex flex-col justify-between items-center h-screen bg-slate-700">
      <div className="flex justify-between grow items-center">
        <form method="POST" className=" border rounded-2xl border-gray-700 max-w-10 bg-gray-900 py-10 px-10 ">
          <div className="flex items-center justify-center mt-2">
            <Image src="https://www.max.se/build/svg/logo-max.svg" alt="Max logo" width={150} height={150} />
          </div>
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-3 min-w-[300px]">
              <div className="flex flex-col">
                <label className="text-white pb-1">Username</label>
                <input
                  type="text"
                  className="block w-full px-3 py-2 text-lg font-normal text-white bg-clip-padding border border-solid border-gray-600 rounded-lg bg-gray-800 focus:outline-none"
                  id="username"
                  placeholder="ab1234"
                  maxLength={6}
                  minLength={6}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-white pb-1">Password</label>
                <input
                  type="password"
                  className="block w-full px-3 py-2 text-lg font-normal text-white bg-clip-padding border border-solid border-gray-600 rounded-lg bg-gray-800 focus:outline-none"
                  id="password"
                  placeholder="Max1234"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex justify-center text-center lg:text-left">
              <button
                type="submit"
                className="inline-block px-16 py-3 bg-[#e41f18] border-white text-white font-medium text-sm leading-snug uppercase rounded-full"
                onClick={handleSubmit}
              >
                {loading && <Loader />}
                {!loading && <span className="text-white">Login</span>}
              </button>
            </div>
            <div className={`flex flex-col  justify-center text-center text-red-600 ${!error ? "hidden" : ""}`}>{message}</div>
          </div>
        </form>
      </div>

      <div className="">
        <div className="block text-center text-sm max-w-xs my-2 text-white">
          <p className="text-red-400 font-extrabold"> version: 1.0.1</p>
          <p className="text-red-400 font-extrabold">Release Type: Beta</p>
          <p>If you find any issue please Contact me at: </p>
          <p> contact@jawadnozari.com</p>

          <p className="pt-4"> © 2023 Jawad Nozari </p>
        </div>
      </div>
    </div>
  );
};

export default Login;