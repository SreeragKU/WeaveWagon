import AdminLayout from '@/components/admin/AdminLayout'
import Distribution from './Distribution'

export const metadata = {
  title: 'Admin Users',
}
const AdminDistributionPage = () => {
  return (
    <AdminLayout activeItem="distribution">
      <Distribution />
    </AdminLayout>
  )
}

export default AdminDistributionPage
