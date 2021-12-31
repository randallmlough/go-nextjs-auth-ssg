import Head from "next/head";
import Link from "next/link";
import Alert from "@ui/Alert";
import AuthenticationFrom from "@components/forms/AuthenticationForm";
import { useAuth } from "@/contexts/AuthProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import WebsiteLayout from "@components/website_layout";
import { PageProps } from "@/types/props";
import { BgColor } from "@/enums/styles";

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated]);

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="min-h-full flex">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <Alert>
              <p>
                Demo credentials
                <br />
                Email: <strong>email@email.com</strong>
                <br />
                Password: <strong>12345678</strong>
              </p>
            </Alert>
            <div>
              <h2 className="mt-12 text-3xl font-extrabold text-gray-700">
                Sign in to your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{" "}
                <Link href="/register">
                  <a className="font-medium text-blue-600 hover:text-blue-500">
                    create a new account
                  </a>
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <AuthenticationFrom />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1617812191081-2a24e3f30e45?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

Login.layout = (page) => <WebsiteLayout hideNav>{page}</WebsiteLayout>;

export async function getStaticProps(context): Promise<PageProps> {
  return {
    props: {
      public: true,
      fullPage: true,
      bgColor: BgColor.WHITE,
    },
  };
}
