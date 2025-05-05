"use client";
import Footer from "./Footer";
import Header from "./Header";
import Toastify from "../../toast-popup/Toastify";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "@/store/reducers/registrationSlice";
import ChatBox from "@/components/chat/ChatBox";

function LayoutOne({ children }) {
  const dispatch = useDispatch();
  const [cssLoaded, setCssLoaded] = useState(false);

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
    // Load CSS
    const cssFilePath = "/assets/css/demo-1.css";
    const link = document.createElement("link");
    link.href = cssFilePath;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setCssLoaded(true);

    return () => {
      // Cleanup CSS
      try {
        document.head.removeChild(link);
      } catch (error) {
        console.error("Error removing CSS:", error);
      }
    };
  }, []);

  return (
    <>
      <Header />
      {children}
      <Footer />
      <Toastify />
      <ChatBox />
    </>
  );
}

export default LayoutOne;
