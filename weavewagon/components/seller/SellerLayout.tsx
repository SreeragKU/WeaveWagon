import { auth } from '@/lib/auth'
import Link from 'next/link'
import React from 'react'

const SellerLayout = async ({
  activeItem = 'dashboard',
  children,
}: {
  activeItem: string
  children: React.ReactNode
}) => {
  const session = await auth()
  if (!session || !session.user.isSeller) {
    return (
      <div className="relative flex flex-grow p-4">
        <div>
          <h1 className="text-2xl">Unauthorized</h1>
          <p>Seller permission required</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-grow">
      <div className="w-full grid md:grid-cols-5">
        <div className="bg-base-200">
          <ul className="menu">
            <li>
              <Link
                className={'dashboard' === activeItem ? 'active' : ''}
                href="/seller/dashboard"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                className={'products' === activeItem ? 'active' : ''}
                href="/seller/products"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                className={'orders' === activeItem ? 'active' : ''}
                href="/seller/orders"
              >
                Orders
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-4 px-4">{children}</div>
      </div>
    </div>
  )
}

export default SellerLayout
