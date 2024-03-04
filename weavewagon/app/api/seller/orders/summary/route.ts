import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel, { OrderItem } from '@/lib/models/OrderModel'
import ProductModel from '@/lib/models/ProductModel'

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

  const products = await ProductModel.find({ createdBy: user._id })
  const totalRevenue = products.reduce((acc, curr) => acc + curr.price, 0)

  const featuredProductsCount = await ProductModel.countDocuments({
    createdBy: user._id,
    isFeatured: true,
  })

  const orders = await OrderModel.find({ user: user._id })
  const orderedProductsCount = orders.reduce(
    (acc, curr) =>
      acc + curr.items.reduce((a: number, c: OrderItem) => a + c.qty, 0),
    0
  )

  const topProductsByRevenue = await OrderModel.aggregate([
    {
      $unwind: '$items',
    },
    {
      $group: {
        _id: '$items.product',
        totalRevenue: { $sum: { $multiply: ['$items.qty', '$items.price'] } },
      },
    },
    {
      $sort: { totalRevenue: -1 },
    },
    {
      $limit: 5,
    },
  ])

  return Response.json({
    totalRevenue,
    featuredProductsCount,
    orderedProductsCount,
    topProductsByRevenue,
  })
})
