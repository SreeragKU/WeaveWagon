import mongoose, { Schema, Document } from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    initialPrice: { type: Number, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    ratings: [{ userEmail: String, rating: Number }],
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    isFeatured: { type: Boolean, default: false },
    banner: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
)

export interface ProductRating {
  userEmail: string
  rating: number
}

export interface Product extends Document {
  _id?: string
  name: string
  slug: string
  image: string
  banner?: string
  initialPrice?: number
  price: number
  brand: string
  description: string
  category: string
  rating: number
  numReviews: number
  countInStock: number
  isFeatured: boolean
  createdBy: string
  ratings: ProductRating[]
}
const ProductModel =
  mongoose.models.Product || mongoose.model('Product', productSchema)

export default ProductModel
