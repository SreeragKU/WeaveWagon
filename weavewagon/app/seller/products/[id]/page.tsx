import SellerLayout from '@/components/seller/SellerLayout'
import Form from './Form'

export function generateMetadata({ params }: { params: { id: string } }) {
  return {
    title: `Edit Product ${params.id}`,
  }
}

export default function ProductEditPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <SellerLayout activeItem="products">
      <Form productId={params.id} />
    </SellerLayout>
  )
}
