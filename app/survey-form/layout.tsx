import React from "react";

function SurveyLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex justify-center w-full h-full items-center">
      {children}
    </div>
  );
}

export default SurveyLayout;
