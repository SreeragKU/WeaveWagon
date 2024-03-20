import { auth } from '@/lib/auth'
import dbConnect from '@/lib/dbConnect'
import ProductModel, { Product } from '@/lib/models/ProductModel'

export const PUT = auth(async (req) => {
  if (!req.auth) {
    return Response.json({ message: 'Not authenticated' }, { status: 401 })
  }

  const { slug, rating } = await req.json()
  const userEmail = req.auth.user?.email
  if (!userEmail) {
    return Response.json(
      { message: 'User email not found in request' },
      { status: 400 }
    )
  }

  await dbConnect()
  try {
    let product: Product | null = await ProductModel.findOne({ slug })

    if (!product) {
      return Response.json(
        { message: 'Product not found' },
        {
          status: 404,
        }
      )
    }
    const userRating = product.ratings.find((r) => r.userEmail === userEmail)
    const { rating: prevRating, numReviews: prevNumReviews } = product
    let newRating = 0
    if (userRating) {
      newRating =
        (prevRating * prevNumReviews - userRating.rating + rating) /
        prevNumReviews
      userRating.rating = rating
    } else {
      newRating = (prevRating * prevNumReviews + rating) / (prevNumReviews + 1)
      product.ratings.push({ userEmail, rating })
      product.numReviews += 1
    }
    product.rating = newRating
    await product.save()
    product = await ProductModel.findOne({ slug })

    return Response.json(
      { message: 'Rating updated successfully', product },
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
