import dbConnect from '@/lib/dbConnect'
import { auth } from '@/lib/auth'
import ProductModel from '@/lib/models/ProductModel'
import OrderModel from '@/lib/models/OrderModel'

export const GET = auth(async (...request: any) => {
  const [req, { params }] = request
  if (!req.auth) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()

  const user = req.auth.user

  const productsCount = await ProductModel.countDocuments({
    createdBy: user._id,
  })

  const productsData = await ProductModel.aggregate([
    {
      $match: { createdBy: user._id },
    },
    {
      $group: {
        _id: '$category',
        totalProducts: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ])

  const salesData = await OrderModel.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'orderItems.productId',
        foreignField: '_id',
        as: 'products',
      },
    },
    {
      $match: {
        'products.createdBy': user._id,
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        totalOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ])

  return Response.json({
    productsCount,
    productsData,
    salesData,
  })
})
