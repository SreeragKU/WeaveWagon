import SellerLayout from '@/components/seller/SellerLayout'
import Dashboard from './Dashboard'

export const metadata = {
  title: 'Seller Dashboard',
}
const DashbaordPage = () => {
  return (
    <SellerLayout activeItem="dashboard">
      <Dashboard />
    </SellerLayout>
  )
}

export default DashbaordPage
