import "./App.css";
import { Analytics, track } from "@vercel/analytics/react";
import { useEffect } from "react";
import Home from "./pages/Home";

function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const referrer = document.referrer.toLowerCase();
    const source = params.get("utm_source") || (referrer.includes("facebook.com") ? "facebook" : null);

    if (source) {
      track("portfolio_view", {
        source,
        medium: params.get("utm_medium") || "referral",
        campaign: params.get("utm_campaign") || "organic_visit",
      });
    }
  }, []);

  return (
    <>
      <Home />
      <Analytics />
    </>
  );
}

export default App;