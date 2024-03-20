'use client'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { OrderItem } from '@/lib/models/OrderModel'
import { Product } from '@/lib/models/ProductModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useState } from 'react'
import { StarOutlined } from '@ant-design/icons'
import { configConsumerProps } from 'antd/es/config-provider'

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string
  paypalClientId: string
}) {
  const [ratings, setRatings] = useState<{ [key: string]: number }>({})

  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('Order delivered successfully')
        : toast.error(data.message)
    }
  )

  const { data: session } = useSession()
  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order.id)
  }

  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((orderData) => {
        toast.success('Order paid successfully')
      })
  }

  const { data, error } = useSWR(`/api/orders/${orderId}`)

  function onItemRatingChange(slug: string, rating: number) {
    setRatings({ ...ratings, [slug]: rating })
  }

  function submitRating(slug: string, rating: number): Promise<void> {
    const confirmed = window.confirm(
      'Are you sure you want to submit this rating?'
    )
    if (!confirmed) {
      return Promise.reject('Rating submission cancelled by user')
    }

    return fetch(`/api/products/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug, rating }),
    })
      .then((response) => {
        if (response.ok) {
          toast.success('Rating submitted successfully')
        } else {
          toast.error('Failed to submit rating')
          return Promise.reject('Failed to submit rating')
        }
      })
      .catch((error) => {
        console.error('Error submitting rating:', error)
        toast.error('Failed to submit rating')
        return Promise.reject('Failed to submit rating')
      })
  }

  if (error) return error.message
  if (!data) return 'Loading...'

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data

  return (
    <div>
      <h1 className="text-2xl py-4">Order {orderId}</h1>
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className="text-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="text-error">Not Delivered</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Payment Method</h2>
              <p>{paymentMethod}</p>
              {isPaid ? (
                <div className="text-success">Paid at {paidAt}</div>
              ) : (
                <div className="text-error">Not Paid</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Items</h2>
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="py-2">Item</th>
                    <th className="py-2">Quantity</th>
                    <th className="py-2">Price</th>
                    {isDelivered && <th className="py-2">Rating</th>}
                    {isDelivered && <th className="py-2">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item.slug} className="border-b">
                      <td className="py-3">
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </td>
                      <td className="py-3">{item.qty}</td>
                      <td className="py-3">₹{item.price}</td>
                      {isDelivered && (
                        <>
                          <td className="py-3 flex items-center">
                            <input
                              className="w-32 mr-2 mt-4"
                              type="range"
                              min="0"
                              max="5"
                              step="0.5"
                              value={
                                ratings[item.slug] !== undefined
                                  ? ratings[item.slug]
                                  : '0'
                              }
                              onChange={(e) =>
                                onItemRatingChange(
                                  item.slug,
                                  parseFloat(e.target.value)
                                )
                              }
                            />
                            <br></br>
                            <StarOutlined
                              style={{
                                fontSize: '1rem',
                                marginRight: '0.5rem',
                                marginTop: '0.8rem',
                              }}
                            />
                            <span
                              style={{
                                marginRight: '0.5rem',
                                marginTop: '0.8rem',
                              }}
                            >
                              {ratings[item.slug] || '0'}
                            </span>
                          </td>
                          <td className="py-3">
                            <button
                              className="btn"
                              onClick={() =>
                                submitRating(item.slug, ratings[item.slug] || 0)
                              }
                            >
                              Submit Rating
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>₹{itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>₹{taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>₹{shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>₹{totalPrice}</div>
                  </div>
                </li>

                {!session?.user.isAdmin &&
                  !isPaid &&
                  paymentMethod === 'PayPal' && (
                    <li>
                      <PayPalScriptProvider
                        options={{ clientId: paypalClientId }}
                      >
                        <PayPalButtons
                          createOrder={createPayPalOrder}
                          onApprove={onApprovePayPalOrder}
                        />
                      </PayPalScriptProvider>
                    </li>
                  )}

                {session?.user.isAdmin && (
                  <li>
                    <button
                      className="btn w-full my-2"
                      onClick={() => deliverOrder()}
                      disabled={isDelivering}
                    >
                      {isDelivering && (
                        <span className="loading loading-spinner"></span>
                      )}
                      Mark as delivered
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
