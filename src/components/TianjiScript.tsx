import { useEffect } from "react";

/**
 * Tianji analytics tracking script with bot filtering.
 * Skips loading the tracker if the visitor is a known bot/crawler.
 */

const BOT_PATTERNS = [
  /bot/i,
  /spider/i,
  /crawl/i,
  /slurp/i,
  /mediapartners/i,
  /headless/i,
  /lighthouse/i,
  /pagespeed/i,
  /gtmetrix/i,
  /pingdom/i,
  /uptimerobot/i,
  /semrush/i,
  /ahref/i,
  /mj12bot/i,
  /dotbot/i,
  /yandex/i,
  /bingbot/i,
  /duckduckbot/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  /bytespider/i,
  /petalbot/i,
  /gptbot/i,
  /claudebot/i,
  /anthropic/i,
  /ccbot/i,
];

function isBot(): boolean {
  if (typeof navigator === 'undefined') return true;
  const ua = navigator.userAgent;
  if (!ua) return true;
  return BOT_PATTERNS.some(pattern => pattern.test(ua));
}

const TianjiScript = () => {
  useEffect(() => {
    // Skip tracking for bots and crawlers
    if (isBot()) {
      console.debug('[Tianji] Bot detected, skipping analytics');
      return;
    }

    const script = document.createElement("script");
    script.src = "https://tianji.ajamy.tech/tracker.js";
    script.async = true;
    script.defer = true;
    script.setAttribute("data-website-id", "cma6w1ur50001z7jicpd8tgvb");
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default TianjiScript;
