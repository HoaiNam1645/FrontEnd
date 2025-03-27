import AdminLayout from "@/components/admin/layout";

export default function CategoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminLayout>{children}</AdminLayout>;
} 