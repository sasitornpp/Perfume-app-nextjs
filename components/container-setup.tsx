"use client";

import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { store } from "@/redux/Store";
import React from "react";
import Header from "./header";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";


interface HeaderProps {
  children: React.ReactNode;
}

const Container: React.FC<HeaderProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div className={`transition-all duration-500 ml-0 w-full h-full`}>
      <Header pathname={pathname} />
      <main
        className={`flex-grow flex flex-col items-center justify-center w-full`}
      >
        <div
          className={`flex ${
            pathname === "/sign-in" || pathname === "/sign-up"
              ? "items-center"
              : "items-start"
          } h-full justify-center w-full`}
        >
          <Provider store={store}>{children}</Provider>
          <SpeedInsights />
          <Analytics />
        </div>
      </main>
    </div>
  );
};

export default Container;
