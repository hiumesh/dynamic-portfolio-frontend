import Link from "next/link";

type PropeTypes = {
  searchParams: {
    from: string | undefined;
    email: string | undefined;
    message: string | undefined;
  };
};

export default function Confirm({ searchParams }: PropeTypes) {
  if (searchParams.from === "signup" && searchParams?.email) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
        <div className="max-w-xl px-5 text-center">
          <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
            Check your inbox
          </h2>
          <p className="mb-2 text-lg text-zinc-500">
            We are glad, that you’re with us ? We’ve sent you a verification
            link to the email address{" "}
            <span className="font-medium text-indigo-500">
              {searchParams.email}
            </span>
            .
          </p>
          <Link
            href="/signin"
            className="mt-3 inline-block w-96 rounded bg-primary px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20"
          >
            Open the App →
          </Link>
        </div>
      </div>
    );
  }

  if (searchParams.from === "forgot-password" && searchParams?.email) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
        <div className="max-w-xl px-5 text-center">
          <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
            Check your inbox
          </h2>
          <p className="mb-2 text-lg text-zinc-500">
            We’ve sent you a reset password link to the email address{" "}
            <span className="font-medium text-indigo-500">
              {searchParams.email}
            </span>
            .
          </p>
          <Link
            href="/signin"
            className="mt-3 inline-block w-96 rounded bg-primary px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20"
          >
            Open the App →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
      <div className="max-w-xl px-5 text-center">
        <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
          Check your inbox
        </h2>
        <p className="mb-2 text-lg text-zinc-500">
          {searchParams?.message || "Have a nice day"}.
        </p>
        <Link
          href="/signin"
          className="mt-3 inline-block w-96 rounded bg-primary px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20"
        >
          Open the App →
        </Link>
      </div>
    </div>
  );
}
