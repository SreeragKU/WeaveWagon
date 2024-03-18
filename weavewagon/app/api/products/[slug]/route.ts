import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import { Product } from '@/lib/models/ProductModel'
import ProductModel from '@/lib/models/ProductModel'

export const PUT = auth(async (req) => {
  if (!req.auth) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 })
  }

  const { slug, rating } = await req.json()

  await dbConnect()
  try {
    const product: Product | null = await ProductModel.findOne({ slug })

    if (!product) {
      return Response.json(
        { message: 'Product not found' },
        {
          status: 404,
        }
      )
    }

    const { rating: prevRating, numReviews: prevNumReviews } = product
    const newNumReviews = prevNumReviews + 1
    const newRating = (prevRating * prevNumReviews + rating) / newNumReviews

    await ProductModel.findOneAndUpdate(
      { slug },
      { rating: newRating, numReviews: newNumReviews }
    )

    return Response.json(
      { message: 'Rating updated successfully' },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error updating rating:', error)
    return Response.json(
      { message: 'Failed to update rating' },
      {
        status: 500,
      }
    )
  }
})
