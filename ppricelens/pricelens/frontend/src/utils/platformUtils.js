/**
 * Platform utilities for consistent styled initial badges and verified store search URLs.
 */

export function getPlatformInfo(platform) {
  const platKey = (
    typeof platform === "string"
      ? platform
      : platform?.slug || platform?.id || platform?.name || ""
  ).toLowerCase();

  const platName = (
    typeof platform === "string"
      ? platform
      : platform?.name || platform?.slug || platform?.id || ""
  );

  if (platKey.includes("flipkart")) {
    return {
      id: "plat-flipkart",
      name: "Flipkart",
      initial: "F",
      gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",
      border: "border-blue-300/40",
      shadow: "shadow-blue-500/25",
      ring: "ring-blue-400/30",
      accentColor: "#2563EB"
    };
  }

  if (platKey.includes("amazon")) {
    return {
      id: "plat-amazon",
      name: "Amazon",
      initial: "A",
      gradient: "bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600",
      border: "border-amber-300/40",
      shadow: "shadow-amber-500/25",
      ring: "ring-amber-400/30",
      accentColor: "#D97706"
    };
  }

  if (platKey.includes("croma")) {
    return {
      id: "plat-croma",
      name: "Croma",
      initial: "C",
      gradient: "bg-gradient-to-br from-teal-500 via-emerald-500 to-emerald-600",
      border: "border-teal-300/40",
      shadow: "shadow-teal-500/25",
      ring: "ring-teal-400/30",
      accentColor: "#0D9488"
    };
  }

  if (platKey.includes("reliance")) {
    return {
      id: "plat-reliance",
      name: "Reliance Digital",
      initial: "R",
      gradient: "bg-gradient-to-br from-rose-500 via-red-500 to-red-600",
      border: "border-rose-300/40",
      shadow: "shadow-rose-500/25",
      ring: "ring-rose-400/30",
      accentColor: "#E11D48"
    };
  }

  // Fallback for custom or unknown platform
  const rawName = platName || "Store";
  return {
    id: platKey || "plat-default",
    name: rawName,
    initial: (rawName[0] || "S").toUpperCase(),
    gradient: "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800",
    border: "border-slate-300/40",
    shadow: "shadow-slate-500/25",
    ring: "ring-slate-400/30",
    accentColor: "#475569"
  };
}

/**
 * Returns verified real search result page URLs for each platform.
 * Formats spaces and special characters with encodeURIComponent.
 */
export function getPlatformSearchUrl(platform, productName = "") {
  const query = encodeURIComponent((productName || "").trim());
  const platKey = (
    typeof platform === "string"
      ? platform
      : platform?.slug || platform?.id || platform?.name || ""
  ).toLowerCase();

  if (platKey.includes("flipkart")) {
    return `https://www.flipkart.com/search?q=${query}`;
  }

  if (platKey.includes("amazon")) {
    return `https://www.amazon.in/s?k=${query}`;
  }

  if (platKey.includes("croma")) {
    return `https://www.croma.com/searchB?q=${query}`;
  }

  if (platKey.includes("reliance")) {
    return `https://www.reliancedigital.in/search?q=${query}`;
  }

  // Graceful fallback
  return `https://www.google.com/search?q=${encodeURIComponent((platform?.name || "") + " " + productName)}`;
}
