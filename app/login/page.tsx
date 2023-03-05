"use client";
import axios from "axios";
import Image from "next/image";
import { NextPage } from "next";
import Cookies from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../components/Loader";
import { formatDate } from "../components/formatDate";

const Login: NextPage = () => {
  //TODO: change useState to something Efficient
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const Router = useRouter();
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
        let query = formatDate(new Date());
        Cookies.set("SESSIONID", res.data[0].value, { expires: 1 / 24 });
        Router.push(`/`);
        return { data: res.data, success: res.status == 200 ? true : false };
      })
      .catch((err) => {
        setMessage(err.response.data);
        setError(true);
        setLoading(false);
        return err;
      });

    return response;
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen md:bg-gradient-to-br md:from-black md:to-slate-700">
      <form method="POST" className="h-full w-screen md:h-fit md:border md:rounded-2xl bg-zinc-900 md:border-gray-300 p-10 md:w-96">
        <div className="absolute left-0 top-0 w-screen md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 572" fill="none">
            <path
              d="M0 514.8L24 438.474C48 362.862 96 209.137 144 123.874C192 37.5375 240 19.6625 288 66.6737C336 114.4 384 228.8 432 247.926C480 266.337 528 191.262 576 228.8C624 266.337 672 420.062 720 467.074C768 514.8 816 457.6 864 438.474C912 420.062 960 437.937 1008 381.274C1056 323.537 1104 191.262 1152 143C1200 94.7375 1248 134.062 1296 133.526C1344 134.062 1392 94.7375 1416 76.3262L1440 57.2V0H1416C1392 0 1344 0 1296 0C1248 0 1200 0 1152 0C1104 0 1056 0 1008 0C960 0 912 0 864 0C816 0 768 0 720 0C672 0 624 0 576 0C528 0 480 0 432 0C384 0 336 0 288 0C240 0 192 0 144 0C96 0 48 0 24 0H0V514.8Z"
              fill="#FFD700"
            />
          </svg>
        </div>

        <div className="flex items-center justify-center mt-2 mb-24 md:mb-10 z-10">
          <Image className="z-10" src="https://www.max.se/build/svg/logo-max.svg" alt="Max logo" width={150} height={150} priority />
        </div>

        <div className="relative h-11 mb-6">
          <input
            type="text"
            className="peer h-10 w-full border-0 border-b-2 text-white border-gray-300 outline-none focus:border-rose-500 bg-transparent placeholder-transparent"
            id="username"
            placeholder="Usename"
            maxLength={6}
            minLength={6}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="off"
          />
          <label
            htmlFor="username"
            className="absolute left-0 -top-3.5 text-white peer-placeholder-shown:text-gray-400  peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all duration-500 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm"
          >
            Username
          </label>
        </div>
        <div className="relative h-11 mb-6">
          <input
            type="password"
            className="peer h-10 w-full border-b-2 text-white border-gray-300 outline-none focus:border-rose-500 bg-transparent placeholder-transparent"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setDisabled(e.target.value.length > 0 ? false : true);
            }}
            required
            autoComplete="off"
          />
          <label
            htmlFor="password"
            className="absolute left-0 -top-3.5 text-white peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all duration-500 peer-focus:-top-3.5 peer-focus:text-white peer-focus:text-sm"
          >
            Password
          </label>
        </div>
        <div className="flex flex-col justify-center items-center text-center mt-4 lg:text-left">
          <button
            disabled={disabled}
            type="submit"
            className="inline-block px-16 py-3 bg-gradient-to-bl from-[#e41f18] to-rose-900 border-white text-white font-medium text-sm leading-snug uppercase rounded-full hover:opacity-80 transition duration-500 ease-in-out"
            onClick={handleSubmit}
          >
            {loading && <Loader />}
            {!loading && <span className="text-white">Login</span>}
          </button>
          <div className={`flex flex-col mt-4 justify-center text-center text-red-600 ${!error ? "hidden" : ""}`}>{message}</div>
        </div>
        <div className="md:hidden flex justify-center mt-8">
          <div className="text-center text-sm max-w-xs my-2 text-white">
            <p>If you find any issue please Contact me at: </p>
            <a className="text-xl text-white hover:text-cyan-400" href="mailto:contact@jawadnozari.com?subject=Issue when showing Table">
              contact@jawadnozari.com
            </a>
            <p className="text-red-400 font-extrabold mt-6"> version: 1.5.2b</p>
            <p className="text-red-400 font-extrabold">Release Type: Beta</p>
            <p className=""> © 2023 Jawad Nozari </p>
          </div>
        </div>
      </form>
      <div className="md:flex md:items-center md:justify-center hidden">
        <div className="text-center text-sm max-w-xs my-2 text-white">
          <p>If you find any issue please Contact me at: </p>
          <a className="text-xl text-white hover:text-cyan-400" href="mailto:contact@jawadnozari.com?subject=Issue when showing Table">
            contact@jawadnozari.com
          </a>
          <p className="text-red-400 font-extrabold mt-6"> version: 1.5.2b</p>
          <p className="text-red-400 font-extrabold">Release Type: Beta</p>
          <p className=""> © 2023 Jawad Nozari </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
