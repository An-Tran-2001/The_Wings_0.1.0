import { AuthLayout } from "layout";
import Image from "next/image";
import Logo from "public/images/logo.png";
import { ReactElement } from "react";

const Home = () => {
  return (
    <main className="h-screen flex min-h-screen flex-col items-center justify-center p-24">
      <Image src={Logo} width={300} height={300} alt={"logo"} />
    </main>
  );
};

export default Home;

Home.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
