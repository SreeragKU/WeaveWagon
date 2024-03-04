import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel from '@/lib/models/ProductModel'

export const GET = auth(async (...args: any) => {
  const [req, { params }] = args
  await dbConnect()
  const product = await ProductModel.findOne({
    _id: params.id,
    createdBy: req.auth.user?._id,
  })
  if (!product) {
    return Response.json(
      { message: 'Product not found or unauthorized' },
      {
        status: 404,
      }
    )
  }
  return Response.json(product)
}) as any

export const PUT = auth(async (...args: any) => {
  const [req, { params }] = args

  try {
    await dbConnect()

    const {
      name,
      slug,
      price,
      initialPrice,
      category,
      image,
      brand,
      countInStock,
      description,
      banner,
    } = await req.json()

    const product = await ProductModel.findById(params.id)
    if (!product) {
      return Response.json(
        { message: 'Product not found' },
        {
          status: 404,
        }
      )
    }

    if (product.createdBy.toString() !== req.auth.user?._id) {
      return Response.json(
        { message: 'Unauthorized' },
        {
          status: 401,
        }
      )
    }

    product.name = name
    product.slug = slug
    product.price = price
    product.initialPrice = initialPrice
    product.category = category
    product.image = image
    product.brand = brand
    product.countInStock = countInStock
    product.description = description
    product.banner = banner

    const updatedProduct = await product.save()
    return Response.json(updatedProduct)
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any

export const DELETE = auth(async (...args: any) => {
  const [req, { params }] = args

  try {
    await dbConnect()
    const product = await ProductModel.findById(params.id)
    if (!product) {
      return Response.json(
        { message: 'Product not found' },
        {
          status: 404,
        }
      )
    }

    if (product.createdBy.toString() !== req.auth.user?._id) {
      return Response.json(
        { message: 'Unauthorized' },
        {
          status: 401,
        }
      )
    }

    await product.deleteOne()
    return Response.json({ message: 'Product deleted successfully' })
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any

export const PATCH = auth(async (...args: any) => {
  const [req, { params }] = args

  try {
    await dbConnect()
    const product = await ProductModel.findById(params.id)

    if (!product) {
      return Response.json(
        { message: 'Product not found' },
        {
          status: 404,
        }
      )
    }

    if (product.createdBy.toString() !== req.auth.user?._id) {
      return Response.json(
        { message: 'Unauthorized' },
        {
          status: 401,
        }
      )
    }
    const updatedProduct = await product.save()
    return Response.json(updatedProduct)
  } catch (err: any) {
    return Response.json(
      { message: err.message },
      {
        status: 500,
      }
    )
  }
}) as any
