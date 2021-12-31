import Head from "next/head";

export default function Public() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Public</title>
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Public</h1>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      public: true,
    },
  };
}
