import EditCategoryForm from "./EditCategoryForm";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  return <EditCategoryForm id={params.id} />;
}