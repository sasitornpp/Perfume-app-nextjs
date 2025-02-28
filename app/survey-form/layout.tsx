"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/Store";
import PerfumeQuiz from "@/components/perfume-quiz";

function SurveyLayout({ children }: { readonly children: React.ReactNode }) {
  const profile = useSelector((state: RootState) => state.user.profile);
  const [currentProfile, setCurrentProfile] = useState(profile);

  useEffect(() => {
    setCurrentProfile(profile);
  }, [profile]);

  if (currentProfile) {
    return <PerfumeQuiz />;
  }

  return (
    <div className="flex justify-center w-full h-full items-center mt-20">
      {children}
    </div>
  );
}

export default SurveyLayout;
