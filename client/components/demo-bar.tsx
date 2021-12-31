export default function DemoBar() {
  return (
    <div className="relative bg-red-600">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="text-center sm:px-16">
          <p className="font-medium text-white">
            <span className="md:hidden">This is a demo project!</span>
            <span className="hidden md:inline">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              This is a demo project. Don't give sensitive data to this app.
            </span>
            <span className="ml-2 inline-block">
              <a
                href="https://github.com/randallmlough/go-nextjs-auth-ssg"
                className="text-white font-bold underline"
              >
                {" "}
                View repository <span aria-hidden="true">&rarr;</span>
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
