import Head from "next/head";
import type { NextPage } from "next";
import Table from "../components/table";
import axios from "axios";
import Bemanningsplan from "./bemanningsplan";

const Home: NextPage = (data) => {
  return (
    <div className="flex justify-center font_Mulish text-center text-xs print:justify-start">
      <Head>
        <title>BemanningsPlan</title>
      </Head>
      <main>
        <div>
          {/* <Bemanningsplan /> */}
          <Table BData={data} />
        </div>
      </main>
    </div>
  );
};

Home.getInitialProps = async () => {
  const body = {
    userName: process.env.VRMUSERNAME,
    password: process.env.VRMPASSWORD,
  };
  const config = {
    url: `http://localhost:${process.env.PORT}/api/getCredential`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify(body),
  };
  const data = await axios(config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.message;
    });

  return { data };
};

export default Home;
