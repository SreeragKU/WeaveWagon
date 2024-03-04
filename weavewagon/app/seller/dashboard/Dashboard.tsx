'use client'
import Link from 'next/link'
import { ProfileOutlined } from '@ant-design/icons'
import useSWR from 'swr'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  BarElement,
} from 'chart.js'

import { formatsellerNumber } from '@/lib/utils'

ChartJS.register(Title, Tooltip, Legend, LinearScale, CategoryScale, BarElement)

const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/seller/orders/summary`)

  if (error) return <div>{error.message}</div>
  if (!summary) return <div>Loading...</div>

  interface TopProductsByRevenueItem {
    _id: { name: string }
    totalRevenue: number
  }

  const topProductsByRevenueData = {
    labels: summary.topProductsByRevenue.map(
      (product: TopProductsByRevenueItem) => product._id.name
    ),
    datasets: [
      {
        label: 'Revenue',
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.6)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: summary.topProductsByRevenue.map(
          (product: TopProductsByRevenueItem) => product.totalRevenue
        ),
      },
    ],
  }

  const monthlyRevenueChartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Revenue ($)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
    },
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
        <div className="stat">
          <div className="stat-title">Total Revenue</div>
          <div className="stat-value text-primary">
            ₹{formatsellerNumber(summary.totalRevenue)}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Featured Products</div>
          <div className="stat-value text-primary">
            {summary.featuredProductsCount}
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Ordered Products</div>
          <div className="stat-value text-primary">
            {summary.orderedProductsCount}
          </div>
        </div>
      </div>
      <div className="my-4">
        <h2 className="text-lg font-semibold mb-4">Top Products by Revenue</h2>
        <Bar data={topProductsByRevenueData} />
      </div>
    </div>
  )
}

export default Dashboard
