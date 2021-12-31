import Head from "next/head";
import Link from "next/link";
import AuthRegistrationFrom from "@components/forms/AuthRegisterationForm";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect } from "react";
import WebsiteLayout from "@components/website_layout";
import { PageProps } from "@/types/props";
import { BgColor } from "@/enums/styles";

export default function Register() {
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
        <title>Register</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-full flex">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-12 text-3xl font-extrabold text-gray-700">
                Create a new account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Or{" "}
                <Link href="/login">
                  <a className="font-medium text-blue-600 hover:text-blue-500">
                    sign in to your existing account
                  </a>
                </Link>
              </p>
            </div>

            <div className="mt-8">
              <div className="mt-6">
                <AuthRegistrationFrom />
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1610021685072-9906775314c9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
          />
        </div>
      </div>
    </>
  );
}

Register.layout = (page) => <WebsiteLayout hideNav>{page}</WebsiteLayout>;

export async function getStaticProps(context): Promise<PageProps> {
  return {
    props: {
      public: true,
      fullPage: true,
      bgColor: BgColor.WHITE,
    },
  };
}
