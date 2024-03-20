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

  const productDetails = await Promise.all(
    products.map(async (product) => {
      const numReviews = product.numReviews
      const rating = product.rating
      return {
        name: product.name,
        numReviews: numReviews,
        rating: rating,
      }
    })
  )

  let totalRevenueFromOrders = 0
  for (const product of products) {
    const orders = await OrderModel.find({ 'items.product': product._id })

    for (const order of orders) {
      const orderItem = order.items.find(
        (item: OrderItem) => item.product.toString() === product._id.toString()
      )

      if (orderItem) {
        totalRevenueFromOrders += orderItem.qty * product.price
      }
    }
  }
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
    totalRevenue: totalRevenueFromOrders,
    featuredProductsCount,
    orderedProductsCount,
    topProductsByRevenue,
    productDetails,
  })
})
