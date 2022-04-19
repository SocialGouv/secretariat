import { useCallback, useEffect, useState } from "react"
import useIsDarkTheme from "@/hooks/use-is-dark-theme"

const ThemeToggleButton = () => {
  const { isDarkTheme, setIsDarkTheme } = useIsDarkTheme()

  useEffect(() => {
    if (isDarkTheme !== undefined) {
      localStorage.isDarkTheme = isDarkTheme
      if (isDarkTheme) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [isDarkTheme])

  const setIsDarkThemeCallback = useCallback(
    () =>
      setIsDarkTheme(
        localStorage.isDarkTheme === "true" ||
          (!("isDarkTheme" in localStorage) &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
      ),
    [setIsDarkTheme]
  )

  useEffect(() => {
    setIsDarkThemeCallback()
  }, [setIsDarkThemeCallback])

  return (
    <button onClick={() => setIsDarkTheme(!isDarkTheme)}>
      <i
        className={`theme-toggle-button ${
          isDarkTheme ? "ri-moon-line" : "ri-sun-line"
        }`}
      ></i>
    </button>
  )
}

export default ThemeToggleButton
