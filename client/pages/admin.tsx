import Head from "next/head";
import ProfileForm from "@components/forms/ProfileForm";
import { useAuth } from "@/contexts/AuthProvider";
import { PageProps } from "@/types/props";
import { BgColor } from "@/enums/styles";
import { UserRoles } from "@components/PrivateRoute";

export default function Profile() {
  const { user } = useAuth();
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>

      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="bg-white space-y-6">
          <div className="px-4 sm:p-6">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Admin
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This is a protected admin page. Only the demo account should
                have access to this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps(context): Promise<PageProps> {
  return {
    props: {
      requiredUserRoles: [UserRoles.ADMIN],
    },
  };
}
