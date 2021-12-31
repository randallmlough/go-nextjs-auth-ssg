import "tailwindcss/tailwind.css";
import { AuthProvider } from "@/contexts/AuthProvider";
import PrivateRoute from "@components/PrivateRoute";
import fetcher from "@api/fetchJson";
import { SWRConfig } from "swr";
import { useEffect } from "react";
import AppLayout from "@components/app_layout";
import HtmlBodyClasses from "@/utils/classes";
import { useRouter } from "next/router";

// types
import { AppPropsWithLayout } from "@/types/props";

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  const { htmlClasses, bodyClasses } = HtmlBodyClasses({
    isFullPage: pageProps.fullPage,
    bgColor: pageProps.bgColor,
  });
  useEffect(() => {
    document.querySelector("html").className = htmlClasses;
    document.body.className = bodyClasses;
  });

  const getLayout =
    Component.layout ??
    ((page) => <AppLayout hideNav={pageProps.hideNav}>{page}</AppLayout>);

  const requiredUserRoles = pageProps.requiredUserRoles;
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <AuthProvider>
        <PrivateRoute
          isPublic={pageProps.public}
          requiredUserRoles={requiredUserRoles}
        >
          {getLayout(<Component {...pageProps} />)}
        </PrivateRoute>
      </AuthProvider>
    </SWRConfig>
  );
}
