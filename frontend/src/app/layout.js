import Navbar from "@/components/nav/Navbar";
import AuthProvider from "@/components/auth/AuthProvider";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="max-w-4xl mx-auto p-4">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
