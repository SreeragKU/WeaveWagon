import SellerLayout from '@/components/seller/SellerLayout'
import Products from './Products'

export const metadata = {
  title: 'Seller Products',
}
const SellerProductsPage = () => {
  return (
    <SellerLayout activeItem="products">
      <Products />
    </SellerLayout>
  )
}

export default SellerProductsPage
