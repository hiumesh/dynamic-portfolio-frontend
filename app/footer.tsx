import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black px-6 py-12">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div>
            <Image
              src="/logotype-white.svg"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>
          <p className="text-sm text-gray-400">
            © 2024 Flex, Inc. Based in India.
          </p>
          <p className="text-sm text-gray-400">by @swagbaba</p>
        </div>
      </div>
    </footer>
  );
}
