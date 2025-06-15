import "./globals.css";
import Navbarr from "@/components/Navbarr";
import { AuthProvider } from "./context/AuthContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <Navbarr/>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}