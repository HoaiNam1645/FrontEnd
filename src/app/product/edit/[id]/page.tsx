import EditProductForm from "./EditProductForm";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <EditProductForm id={params.id} />;
} 