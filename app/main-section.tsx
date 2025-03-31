"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const items = [
  {
    title: "Portfolio",
    description: "Explore the portfolio of people",
    href: "/portfolio",
    linkText: "Explore",
    color: "#ef4444",
  },
  {
    title: "Work Gallery",
    description: "Explore the work of people",
    href: "/work-gallery",
    linkText: "Explore",
    color: "#f97316",
  },
  {
    title: "Blogs",
    description: "Explore the blogs of people",
    href: "/blogs",
    linkText: "Explore",
    color: "#a855f7",
  },
];

export default function MainSection() {
  const [color, setColor] = useState<string | null>(null);
  return (
    <main
      className="min-h-screen relative"
      style={
        {
          "--hero-gradient-from": color || "#22c55e",
          "--hero-gradient-to": color ? "white" : "#eab308",
          "--hero-bg-gradient-color": color + "2A" || "#000",
        } as any
      }
    >
      <div className="absolute left-0 -z-10 top-0 h-full w-full">
        <div className="relative  h-full w-full bg-black/95">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          <div className="absolute left-[50%] -translate-x-1/2 right-0 h-full w-full bg-[radial-gradient(circle_800px_at_50%_800px,var(--hero-bg-gradient-color),#000)]"></div>
        </div>
      </div>

      <section className="mx-auto  max-w-screen-lg min-h-screen flex flex-col items-center p-10 pt-24 space-y-10">
        <h1 className="text-9xl font-extrabold text-transparent bg-gradient-to-r from-[--hero-gradient-from] to-[--hero-gradient-to] bg-clip-text text-center leading-[0.8]">
          Flex
          <br />
          Yourself
        </h1>
        <p className="text-center text-gray-300">
          Free & Open source platform for software developers to flex
          <br />
          Build Portfolio, Show Work and Share Blogs
        </p>
        <div className="w-full flex gap-3 text-white">
          {items.map((item) => (
            <div
              key={item.title}
              className="group text-center flex-1 bg-gray-800/45 backdrop-blur-md rounded-md first:rounded-l-3xl last:rounded-r-3xl p-6 space-y-4 hover:scale-x-105 transition-all"
              onMouseEnter={() => setColor(item.color)}
              onMouseLeave={() => setColor(null)}
            >
              <h1 className="text-xl font-semibold text-white tracking-wide">
                {item.title}
              </h1>
              <p className="text-gray-300 font-normal text-medium pb-6">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="inline-flex items-center text-black text-sm gap-1 px-3 py-1.5 bg-white rounded-full group-hover:bg-[--background-color] group-hover:text-white"
                style={
                  {
                    "--background-color": item.color,
                  } as any
                }
              >
                {item.linkText}
                <ArrowUpRight
                  className="text-gray-600 group-hover:text-white"
                  strokeWidth={1.4}
                  size={18}
                />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
