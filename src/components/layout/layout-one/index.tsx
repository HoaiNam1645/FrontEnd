"use client";
import Footer from "./Footer";
import Header from "./Header";
import Toastify from "../../toast-popup/Toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/reducers/registrationSlice";

function LayoutOne({ children }) {
  const dispatch = useDispatch();

  // Load user data from localStorage when component mounts
  useEffect(() => {
    try {
      const token = localStorage.getItem("login_token");
      const userData = localStorage.getItem("login_user");
      if (token && userData) {
        const user = JSON.parse(userData);
        console.log("Layout - Loading user from localStorage:", user);
        dispatch(setUserData({ isAuthenticated: true, user }));
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    const cssFilePath = "/assets/css/demo-1.css";
    const link = document.createElement("link");
    link.href = cssFilePath;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <>
      <Header />
      {children}
      <Footer />
      <Toastify />
    </>
  );
}

export default LayoutOne;
