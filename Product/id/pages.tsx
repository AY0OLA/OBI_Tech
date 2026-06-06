export default async function Product({
  params,
}: {
  params: Promise<{ id: String }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1>{id}</h1>
    </div>
  );
}
