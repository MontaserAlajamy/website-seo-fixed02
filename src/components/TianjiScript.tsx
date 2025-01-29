import React, { useEffect } from "react";

const TianjiScript = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tianji.elagami.tech/tracker.js";
    script.async = true;
    script.defer = true;
    script.setAttribute("data-website-id", "cm5u5ze0q0001kzx1tj5odqr2");
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); // Cleanup script on component unmount
    };
  }, []);

  return null;
};

export default TianjiScript;
