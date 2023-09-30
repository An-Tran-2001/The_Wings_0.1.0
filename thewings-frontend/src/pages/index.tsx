import { AuthLayout } from "layout";
import { ReactElement } from "react";
import { Home } from "screens";

export default function Page() {
  return <Home />;
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};
