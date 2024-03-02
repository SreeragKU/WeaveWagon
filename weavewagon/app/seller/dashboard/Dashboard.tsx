'use client'

import Link from 'next/link'
import {
  DollarCircleOutlined,
  ShoppingCartOutlined,
  ProfileOutlined,
  LineChartOutlined,
} from '@ant-design/icons'
import { Line } from 'react-chartjs-2'
import useSWR from 'swr'
import { formatsellerNumber } from '@/lib/utils'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/seller/orders/summary`)

  if (error) return <div>{error.message}</div>
  if (!summary) return <div>Loading...</div>

  const salesData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Sales',
        data: summary.salesData.map(
          (x: { totalSales: number }) => x.totalSales
        ),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return (
    <div>
      <div className="my-4 stats inline-grid md:flex  shadow stats-vertical   md:stats-horizontal">
        <div className="stat">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="stat-title">Sales</div>
              <div className="stat-value text-primary">
                ₹{formatsellerNumber(summary.ordersPrice)}
              </div>
              <div className="stat-desc">
                <Link href="/seller/orders">View sales</Link>
              </div>
            </div>
            <DollarCircleOutlined
              style={{ marginLeft: '50px', fontSize: '5em', color: 'gold' }}
            />
          </div>
        </div>
        <div className="stat">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="stat-title"> Orders</div>
              <div className="stat-value text-primary">
                {summary.ordersCount}
              </div>
              <div className="stat-desc">
                <Link href="/seller/orders">View orders</Link>
              </div>
            </div>
            <ShoppingCartOutlined
              style={{ marginLeft: '50px', fontSize: '5em', color: 'gold' }}
            />
          </div>
        </div>
        <div className="stat">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="stat-title">Products</div>
              <div className="stat-value text-primary">
                {summary.productsCount}
              </div>
              <div className="stat-desc">
                <Link href="/seller/products">View products</Link>
              </div>
            </div>
            <ProfileOutlined
              style={{ marginLeft: '50px', fontSize: '5em', color: 'gold' }}
            />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <h2 className="text-xl py-2 flex items-center">
          <LineChartOutlined className="mr-2" /> Sales Report
        </h2>
        <Line data={salesData} />
      </div>
    </div>
  )
}

export default Dashboard
