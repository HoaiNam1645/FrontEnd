import "./globals.css";

import Providers from "@/store/Provider";
import { Loader } from "@/components/loader";
import AuthHandler from "./_app";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "TECHSHOP",
  description: "Multipurpose eCommerce React NextJS Template",

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body style={{ background: "none" }}>
        <Loader>
          <Providers>
            <AuthHandler>
              <div>{children}</div>
            </AuthHandler>
          </Providers>
        </Loader>
      </body>
    </html>
  );
}
