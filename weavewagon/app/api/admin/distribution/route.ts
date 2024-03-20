import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import OrderModel, { Order } from '@/lib/models/OrderModel'
import ProductModel, { Product } from '@/lib/models/ProductModel'
import UserModel, { User } from '@/lib/models/UserModel'

export const GET = auth(async (req: any) => {
  if (!req.auth || !req.auth.user?.isAdmin) {
    return Response.json(
      { message: 'unauthorized' },
      {
        status: 401,
      }
    )
  }
  await dbConnect()

  const orders: Order[] = await OrderModel.find().populate(
    'items.product',
    'createdBy price'
  )
  const products: Product[] = await ProductModel.find()
  const users: User[] = await UserModel.find()

  const userRevenueMap = new Map<string, number>()

  orders.forEach((order) => {
    order.items.forEach((item) => {
      const product = products.find(
        (p) => p._id && p._id.toString() === item.product?._id?.toString()
      )

      if (product && product.createdBy) {
        const user = users.find(
          (u) => u._id.toString() === product.createdBy.toString()
        )
        if (user) {
          const revenue = item.qty * product.price
          const totalRevenue = userRevenueMap.get(user._id) || 0
          userRevenueMap.set(user._id, totalRevenue + revenue)
        }
      }
    })
  })

  const userRevenueArray = Array.from(userRevenueMap, ([userId, revenue]) => {
    const user = users.find((u) => u._id === userId)
    return {
      email: user?.email || '',
      revenue,
    }
  })

  return Response.json(userRevenueArray)
}) as any
