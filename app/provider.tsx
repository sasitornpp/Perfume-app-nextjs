"use client";

import React from "react";
import { store } from "@/redux/Store";
import { Provider } from "react-redux";
import Container from "@/components/container-setup";

interface ProviderComponentProps {
  children: React.ReactNode;
}

const ProviderComponent: React.FC<ProviderComponentProps> = ({
  children,
}) => {
  return (
    <Provider store={store}>
      <Container >{children}</Container>;
    </Provider>
  );
};

export default ProviderComponent;
