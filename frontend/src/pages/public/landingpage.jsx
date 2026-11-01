import React from "react";
import Start from "./Start.jsx";
import AssessmentDemoCard from "./AssessmentDemo.jsx";
import Phone from "./Phone.jsx";
import Services from "./Services.jsx";
import Steps from "./Steps.jsx";
import Hours from "./Hours.jsx";
import Footer from "./Footer.jsx";


const SHOW_ASSESSMENT_DEMO = true;

export default function LandingPage() {
  return (
    <>
      <Start />
      {SHOW_ASSESSMENT_DEMO && <AssessmentDemoCard />}
      <Phone />
      <Services />
      <Steps />
      <Hours />
      <Footer />
    </>
  );
}