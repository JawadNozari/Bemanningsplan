import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Table from "../components/table";
import cn from "classnames";

const Home: NextPage = () => {
  let Behidden = true;

  return (
    <div className="flex justify-center print:justify-start ">
      <Head>
        <title>BemanningsPlan</title>
      </Head>

      <main>
        <div className={cn({ hidden: !Behidden })}>
          <Table />
        </div>

        <div
          className={cn(
            "justify-center items-center w-screen bg-black h-screen",
            { hidden: Behidden, flex: !Behidden }
          )}
        >
          <div className="text-white">
            <div>
              <p className="text-4xl font-bold text-center">
                This Page will be down until approval from
              </p>
              <p className="font-bold text-6xl text-center ">MAX AB</p>
            </div>
          </div>
          <div className=" absolute bottom-5 text-green-500">
            Coming back soon 🙂
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
