import { ReactNode, useEffect, useState } from "react";
import SidebarMenu from "../components/SidebarMenu";
import AllHighlightsPage from "./AllHighlightsPage";
import { Layout } from "../Layout";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/all");
  }, []);

  return <></>;
}
