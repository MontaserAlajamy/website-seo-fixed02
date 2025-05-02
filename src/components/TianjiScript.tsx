import React, { useEffect } from "react";

const TianjiScript = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://tianji.ajamy.tech/tracker.js";
    script.async = true;
    script.defer = true;
    script.setAttribute("data-website-id", "cma6w1ur50001z7jicpd8tgvb");
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script); // Cleanup script on component unmount
    };
  }, []);

  return null;
};

export default TianjiScript;
