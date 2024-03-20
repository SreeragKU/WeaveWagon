'use client'
import Link from 'next/link'
import { ProfileOutlined } from '@ant-design/icons'
import useSWR from 'swr'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'

import { formatsellerNumber } from '@/lib/utils'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement
)

const Dashboard = () => {
  const { data: summary, error } = useSWR(`/api/seller/orders/summary`)

  if (error) return <div>{error.message}</div>
  if (!summary) return <div>Loading...</div>

  const productDetails: { name: string; numReviews: number; rating: number }[] =
    summary.productDetails || []

  const productNames = productDetails.map((product) => product.name)
  const numReviewsData = productDetails.map((product) => product.numReviews)
  const ratingData = productDetails.map((product) => product.rating)

  const numReviewsChartData = {
    labels: productNames,
    datasets: [
      {
        label: 'Number of Reviews',
        data: numReviewsData,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  const ratingChartData = {
    labels: productNames,
    datasets: [
      {
        label: 'Rating',
        data: ratingData,
        fill: false,
        borderColor: 'rgba(255, 206, 86, 1)',
        tension: 0.1,
      },
    ],
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true,
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
      <div
        className="chart-container overflow-x-auto"
        style={{ height: '400px', width: '100%' }}
      >
        <div>
          <h2>Number of Reviews</h2>
          <Bar data={numReviewsChartData} options={options} />
        </div>
        <div>
          <h2>Rating</h2>
          <Line data={ratingChartData} options={options} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
