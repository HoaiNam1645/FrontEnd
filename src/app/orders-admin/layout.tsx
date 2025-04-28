"use client";

import AdminLayout from "@/components/admin/layout";

export default function OrdersAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
} 