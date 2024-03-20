'use client'
import React, { useEffect, useState } from 'react'

const Distribution: React.FC = () => {
  const [userRevenue, setUserRevenue] = useState<
    { email: string; revenue: number }[]
  >([])

  useEffect(() => {
    fetch('/api/admin/distribution')
      .then((response) => response.json())
      .then((data) => setUserRevenue(data))
  }, [])

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {userRevenue.map((user) => (
              <tr key={user.email}>
                <td>{user.email}</td>
                <td>₹{user.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Distribution
