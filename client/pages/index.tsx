import Head from "next/head";
import FeatureList from "@components/FeatureList";
import { ExternalLink } from "@ui/Link";
import WebsiteLayout from "@components/website_layout";

const features = [
  {
    name: "NextJS 12",
  },
  {
    name: "TypeScript",
  },
  {
    name: "TailwindCSS",
  },
  {
    name: "Authentication and Registration",
  },
  {
    name: "Authorization and RBAC",
  },
  {
    name: "Go(lang) API",
  },
  {
    name: "PostgreSQL 12",
  },
  {
    name: "Single Deployable Binary",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>NextJS SSG with Auth</title>
      </Head>

      <main>
        <div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
          <h1 className="text-6xl font-bold">NextJS SSG with Auth</h1>
          <h3 className="text-2xl text-gray-600 mt-3">and other cool things</h3>
        </div>
        <div className="container mt-16">
          <dl className="space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
            <FeatureList features={features} />
          </dl>
          <div className="flex justify-center mt-20">
            <ExternalLink href="https://github.com/randallmlough/go-nextjs-auth-ssg">
              View repository
            </ExternalLink>
          </div>
        </div>
      </main>
    </div>
  );
}

Home.layout = (page) => <WebsiteLayout>{page}</WebsiteLayout>;

export async function getStaticProps(context) {
  return {
    props: {
      public: true,
    },
  };
}
