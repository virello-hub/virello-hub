import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import PublicLayout from "./components/PublicLayout";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Virello",
  description: "Magazin online Virello",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={poppins.variable}>
        <CartProvider>
          <PublicLayout>{children}</PublicLayout>
        </CartProvider>
      </body>
    </html>
  );
}