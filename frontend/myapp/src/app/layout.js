import { Manrope, Reem_Kufi, Roboto } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const reemKufi = Reem_Kufi({
  subsets: ["latin"],
  variable: "--font-reem-kufi",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${manrope.variable} ${reemKufi.variable} ${roboto.variable}`}>
      <body className="min-h-full flex flex-col font-roboto">
        {children}
      </body>
    </html>
  );
}