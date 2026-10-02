import confetti from "canvas-confetti";

export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(num) {
  if (!num) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}

export function triggerDealConfetti() {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors: ["#5B5FEF", "#00C896", "#38BDF8", "#F472B6"]
  });
}
