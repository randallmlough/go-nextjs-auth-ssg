import Head from "next/head";
import ProfileForm from "@components/forms/ProfileForm";
import { useAuth } from "@/contexts/AuthProvider";

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
                Profile
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                This is a demo project meant to show off different technologies.
                <strong> Do not give sensitive information</strong>.
              </p>
            </div>
          </div>
          <div className="px-4 sm:p-6">
            {user ? (
              <ProfileForm id="profile-form" defaultValues={user} />
            ) : (
              <div>
                <p>Loading form...</p>
              </div>
            )}
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-4">
            <button className="bg-transparent border border-transparent rounded-md py-2 inline-flex justify-center text-red-500 hover:text-red-400 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Delete user
            </button>
            <button
              form="profile-form"
              type="submit"
              className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
