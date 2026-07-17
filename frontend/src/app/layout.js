import Navbar from "@/components/nav/Navbar";
import AuthProvider from "@/components/auth/AuthProvider";
import "./globals.css";

import Providers from "@/components/Providers";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <Navbar />
            <main className=" mx-auto">
              {children}
            </main>
          </AuthProvider></Providers>
      </body>
    </html>
  );
}
