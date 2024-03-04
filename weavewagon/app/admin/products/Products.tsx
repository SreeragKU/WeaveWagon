'use client'
import { Product } from '@/lib/models/ProductModel'
import { formatId } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { EditOutlined, DeleteOutlined, StarOutlined } from '@ant-design/icons'
import Image from 'next/image'

export default function Products() {
  const { data: products, error } = useSWR(`/api/admin/products`)

  const router = useRouter()

  const { trigger: deleteProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading('Deleting product...')
      const res = await fetch(`${url}/${arg.productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('Product deleted successfully', {
            id: toastId,
          })
        : toast.error(data.message, {
            id: toastId,
          })
    }
  )

  const { trigger: createProduct, isMutating: isCreating } = useSWRMutation(
    `/api/admin/products`,
    async (url) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)

      toast.success('Product created successfully')
      router.push(`/admin/products/${data.product._id}`)
    }
  )

  const { trigger: toggleFeatureProduct } = useSWRMutation(
    `/api/admin/products`,
    async (url, { arg }: { arg: { productId: string } }) => {
      const toastId = toast.loading('Toggling product feature...')
      const res = await fetch(`${url}/${arg.productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFeatured: true }),
      })
      const data = await res.json()
      res.ok
        ? toast.success('Product feature toggled successfully', {
            id: toastId,
          })
        : toast.error(data.message, {
            id: toastId,
          })
    }
  )

  const handleToggleFeature = (productId: string) => {
    toggleFeatureProduct({ productId })
  }

  if (error) return 'An error has occurred.'
  if (!products) return 'Loading...'

  const productsByEmail: Record<string, Product[]> = (
    products as Product[]
  ).reduce((acc: Record<string, Product[]>, product: Product) => {
    const email = product.createdBy
    if (!acc[email]) {
      acc[email] = []
    }
    acc[email].push(product)
    return acc
  }, {})

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="py-4 text-2xl">Products</h1>
        <button
          disabled={isCreating}
          onClick={() => createProduct()}
          className="btn btn-primary btn-sm"
        >
          {isCreating && <span className="loading loading-spinner"></span>}
          Create
        </button>
      </div>

      <div className="overflow-x-auto">
        {Object.entries(productsByEmail).map(([email, products]) => (
          <div key={email} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{email}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product: Product) => (
                <div
                  key={product._id}
                  className="relative bg-white rounded-lg p-4 shadow-md"
                  style={{
                    backgroundImage: `url(${product.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'saturate(0.5)',
                  }}
                >
                  <div className="absolute inset-0 bg-gray-300 opacity-40 rounded-lg"></div>
                  <div className="z-10 relative text-white">
                    <h3 className="text-lg font-semibold mb-2">
                      <span
                        className="gradient-text"
                        style={{ textShadow: '1px 1px 1px rgba(0,0,0,5)' }}
                      >
                        {product.name}
                      </span>
                    </h3>
                    <p className="mb-2">
                      <span
                        className="gradient-text"
                        style={{ textShadow: '1px 1px 1px rgba(0,0,0,5)' }}
                      >
                        Price: ₹{product.price}
                      </span>
                    </p>
                    <p className="mb-2">
                      <span
                        className="gradient-text"
                        style={{ textShadow: '1px 1px 1px rgba(0,0,0,5)' }}
                      >
                        Category: {product.category}
                      </span>
                    </p>
                    <p className="mb-2">
                      <span
                        className="gradient-text"
                        style={{ textShadow: '1px 1px 1px rgba(0,0,0,5)' }}
                      >
                        Count in Stock: {product.countInStock}
                      </span>
                    </p>
                    <p className="mb-2">
                      <span
                        className="gradient-text"
                        style={{ textShadow: '1px 1px 1px rgba(0,0,0,5)' }}
                      >
                        Rating: {product.rating}
                      </span>
                    </p>
                    <p className="mb-2">
                      <span
                        className="gradient-text"
                        style={{ textShadow: '1px 1px 1px rgba(0,0,0,5)' }}
                      >
                        Is Featured: {product.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </p>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/products/${product._id}`}
                        className="btn btn-ghost btn-sm text-blue-500 hover:bg-blue-100 bg-white rounded-full px-3 py-1 transition duration-300 ease-in-out"
                      >
                        <EditOutlined className="text-blue-500" />
                      </Link>
                      <button
                        onClick={() =>
                          deleteProduct({ productId: product._id! })
                        }
                        className="btn btn-ghost btn-sm text-red-500 hover:bg-red-100 bg-white rounded-full px-3 py-1 transition duration-300 ease-in-out"
                      >
                        <DeleteOutlined className="text-red-500" />
                      </button>
                      <button
                        onClick={() => handleToggleFeature(product._id!)}
                        className="btn btn-ghost btn-sm text-yellow-500 hover:bg-yellow-100 bg-white rounded-full px-3 py-1 transition duration-300 ease-in-out"
                      >
                        <StarOutlined className="text-yellow-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(45deg, #8ec5fc, #e0c3fc);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          transition: font-size 0.2s, color 0.2s;
        }
        .gradient-text:hover {
          font-size: 110%;
          color: #ff9a8b;
        }
      `}</style>
    </div>
  )
}
