import { useState, useEffect, useContext } from "react";
import { UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";

export const useCompleteNavigationGuard = (shouldGuard, onConfirm) => {
  const [showModal, setShowModal] = useState(false);
  const [allowNavigation, setAllowNavigation] = useState(false);
  const { navigator } = useContext(NavigationContext);

  // 1. Block React Router navigation
  useEffect(() => {
    if (!shouldGuard || allowNavigation) return;

    const { push, replace } = navigator;

    navigator.push = (...args) => {
      setShowModal(true);
      window.__pendingNavigation = { type: "push", args, method: push };
    };

    navigator.replace = (...args) => {
      setShowModal(true);
      window.__pendingNavigation = { type: "replace", args, method: replace };
    };

    return () => {
      navigator.push = push;
      navigator.replace = replace;
    };
  }, [navigator, shouldGuard, allowNavigation]);

  // 2. Block back/forward buttons
  useEffect(() => {
    if (!shouldGuard || allowNavigation) return;

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setShowModal(true);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [shouldGuard, allowNavigation]);

  // 3. Block refresh/close tab
  useEffect(() => {
    if (!shouldGuard) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldGuard]);

  const confirm = () => {
    if (onConfirm) onConfirm();
    setAllowNavigation(true);
    setShowModal(false);

    // Execute pending navigation after state update
    setTimeout(() => {
      if (window.__pendingNavigation) {
        const { method, args } = window.__pendingNavigation;
        method.apply(navigator, args);
        delete window.__pendingNavigation;
      }
    }, 0);
  };

  const cancel = () => {
    setShowModal(false);
    delete window.__pendingNavigation;
  };

  return { showModal, confirm, cancel };
};
