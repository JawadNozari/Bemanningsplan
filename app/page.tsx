import HomePage from "./HomePage";

const Page = async (props: any) => {
{/* @ts-expect-error Server Component */}
  return <HomePage searchParams={props.searchParams} />;
};

export default Page;
