// import './globals.css'

import AuthProvider from "@/provider/AuthProvider";
import LayoutProvider from "@/provider/LayoutProvider";
import ReactFormProvider from "@/provider/ReactFormProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <AuthProvider>
          <LayoutProvider>
            <ReactFormProvider>{children}</ReactFormProvider>
          </LayoutProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
