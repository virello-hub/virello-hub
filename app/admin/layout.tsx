import type { ReactNode } from "react";
import AdminLayoutClient from "./AdminLayoutClient";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <AdminLayoutClient>
      {children}
    </AdminLayoutClient>
  );
}