import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import { triggerDealConfetti } from "../utils/formatters";

const AlertContext = createContext();

export function AlertProvider({ children }) {
  const { user, openAuthModal } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await api.getPriceAlerts();
      if (res && res.data) {
        setAlerts(res.data);
      }
    } catch (err) {
      console.warn("Error fetching price alerts:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [user]);

  const openAlertModal = (product) => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    setSelectedProduct(product);
    setIsAlertModalOpen(true);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
    setSelectedProduct(null);
  };

  const createAlert = async (productId, targetPrice) => {
    try {
      const res = await api.createPriceAlert(productId, targetPrice);
      triggerDealConfetti();
      await fetchAlerts();
      closeAlertModal();
      return res;
    } catch (err) {
      console.error("Create alert error:", err);
      throw err;
    }
  };

  const deleteAlert = async (alertId) => {
    try {
      await api.deletePriceAlert(alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (err) {
      console.error("Delete alert error:", err);
    }
  };

  return (
    <AlertContext.Provider
      value={{
        alerts,
        loading,
        isAlertModalOpen,
        selectedProduct,
        openAlertModal,
        closeAlertModal,
        createAlert,
        deleteAlert,
        fetchAlerts
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
}
