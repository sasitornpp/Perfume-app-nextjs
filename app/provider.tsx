"use client";

import React from "react";
import { store } from "@/redux/Store";
import { Provider } from "react-redux";
import CacheData from "./cachedata";
import { UserType } from "@/types/user";

interface ProviderComponentProps {
  user: UserType;
  children: React.ReactNode;
}

const ProviderComponent: React.FC<ProviderComponentProps> = ({
  user,
  children,
}) => {
  return (
    <Provider store={store}>
      <CacheData user={user}>{children}</CacheData>
    </Provider>
  );
};

export default ProviderComponent;