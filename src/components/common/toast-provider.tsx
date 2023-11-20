"use client"

import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import useIsDarkTheme from "@/hooks/use-is-dark-theme"

export function ToastProvider() {
  const { isDarkTheme } = useIsDarkTheme()
  return (
    <ToastContainer
      position={toast.POSITION.BOTTOM_RIGHT}
      theme={isDarkTheme ? "dark" : "light"}
    />
  )
}
