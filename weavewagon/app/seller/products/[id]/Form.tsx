'use client'
import useSWRMutation from 'swr/mutation'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { ValidationRule, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Product } from '@/lib/models/ProductModel'
import { formatId } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { InfoCircleOutlined } from '@ant-design/icons'

export default function ProductEditForm({ productId }: { productId: string }) {
  const { data: product, error } = useSWR(`/api/seller/products/${productId}`)
  const router = useRouter()
  const { trigger: updateProduct, isMutating: isUpdating } = useSWRMutation(
    `/api/seller/products/${productId}`,
    async (url, { arg }) => {
      const res = await fetch(`${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arg),
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.message)

      toast.success('Product updated successfully')
      router.push('/seller/products')
    }
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Product>()

  useEffect(() => {
    if (!product) return
    // @ts-ignore
    setValue('name', product.name)
    // @ts-ignore
    setValue('slug', product.slug)
    // @ts-ignore
    setValue('price', product.initialPrice)
    // @ts-ignore
    setValue('image', product.image)
    // @ts-ignore
    setValue('category', product.category)
    // @ts-ignore
    setValue('brand', product.brand)
    // @ts-ignore
    setValue('countInStock', product.countInStock)
    // @ts-ignore
    setValue('description', product.description)
    // @ts-ignore
    setValue('banner', product.banner)
  }, [product, setValue])

  const calculateTotalPrice = (price: number, isSubmitting: boolean) => {
    let serviceCharge = 0
    if (price < 100) {
      serviceCharge = price * 0.07
    } else if (price < 750) {
      serviceCharge = price * 0.09
    } else {
      serviceCharge = price * 0.1
    }

    if (isSubmitting) {
      return price + serviceCharge
    } else {
      return price - serviceCharge
    }
  }

  const formSubmit = async (formData: any) => {
    const price = parseFloat(formData.price)
    const totalPrice = calculateTotalPrice(price, true)
    await updateProduct({ ...formData, price: totalPrice, initialPrice: price })
  }

  if (error) return error.message
  if (!product) return 'Loading...'

  const FormInput = ({
    id,
    name,
    required,
    pattern,
  }: {
    id: keyof Product
    name: string
    required?: boolean
    pattern?: ValidationRule<RegExp>
  }) => {
    const [showInfo, setShowInfo] = useState(false)

    const toggleInfo = () => {
      setShowInfo(!showInfo)
    }

    const closeInfo = () => {
      setShowInfo(false)
    }

    return (
      <div className="md:flex mb-6 relative">
        <label className="label md:w-1/5" htmlFor={id}>
          {name}{' '}
          {id === 'price' && (
            <span
              className="text-primary cursor-pointer ml-1"
              onClick={toggleInfo}
            >
              <InfoCircleOutlined />
            </span>
          )}
        </label>
        <div className="md:w-4/5">
          <input
            type="text"
            id={id}
            {...register(id, {
              required: required && `${name} is required`,
              pattern,
            })}
            className="input input-bordered w-full max-w-md"
            onBlur={closeInfo}
          />
          {errors[id]?.message && (
            <div className="text-error">{errors[id]?.message}</div>
          )}
        </div>
        {id === 'price' && showInfo && (
          <div className="absolute z-10 p-2 bg-white border border-gray-300 rounded shadow-md text-sm">
            <p className="font-semibold">Service Charge:</p>
            <p className="ml-2">
              If price is less than 100, service charge is 7%.
            </p>
            <p className="ml-2">
              If price is between 100 and 750, service charge is 9%.
            </p>
            <p className="ml-2">Otherwise, service charge is 10%.</p>
          </div>
        )}
      </div>
    )
  }

  const uploadHandler = async (e: any) => {
    const toastId = toast.loading('Uploading image...')
    try {
      const resSign = await fetch('/api/cloudinary-sign', {
        method: 'POST',
      })
      const { signature, timestamp } = await resSign.json()
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp)
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await res.json()
      setValue('image', data.secure_url)
      toast.success('File uploaded successfully', {
        id: toastId,
      })
    } catch (err: any) {
      toast.error(err.message, {
        id: toastId,
      })
    }
  }
  const uploadBannerHandler = async (e: any) => {
    const toastId = toast.loading('Uploading banner...')
    try {
      const resSign = await fetch('/api/cloudinary-sign', {
        method: 'POST',
      })
      const { signature, timestamp } = await resSign.json()
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp)
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await res.json()
      setValue('banner', data.secure_url)
      toast.success('Banner uploaded successfully', {
        id: toastId,
      })
    } catch (err: any) {
      toast.error(err.message, {
        id: toastId,
      })
    }
  }

  return (
    <div>
      <h1 className="text-2xl py-4">Edit Product {formatId(productId)}</h1>
      <div>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormInput name="Name" id="name" required />
          <FormInput name="Slug" id="slug" required />
          <FormInput name="Image" id="image" required />
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="imageFile">
              Upload Image
            </label>
            <div className="md:w-4/5">
              <input
                type="file"
                className="file-input w-full max-w-md"
                id="imageFile"
                onChange={uploadHandler}
              />
            </div>
          </div>
          <FormInput name="Price" id="price" required />
          <FormInput name="Category" id="category" required />
          <FormInput name="Brand" id="brand" required />
          <FormInput name="Description" id="description" required />
          <FormInput name="Count In Stock" id="countInStock" required />
          <FormInput name="Banner" id="banner" required />
          <div className="md:flex mb-6">
            <label className="label md:w-1/5" htmlFor="bannerFile">
              Upload Banner
            </label>
            <div className="md:w-4/5">
              <input
                type="file"
                className="file-input w-full max-w-md"
                id="bannerFile"
                onChange={uploadBannerHandler}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isUpdating}
            className="btn btn-primary"
          >
            {isUpdating && <span className="loading loading-spinner"></span>}
            Update
          </button>
          <Link className="btn ml-4 " href="/seller/products">
            Cancel
          </Link>
        </form>
      </div>
    </div>
  )
}
