import { Product } from '@/lib/models/ProductModel'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Rating } from './Rating'

export default function ProductItem({ product }: { product: Product }) {
  return (
    <div className="card bg-base-300 shadow-xl mb-4">
      <figure style={{ height: '300px', width: '100%', position: 'relative' }}>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.image}
            alt={product.name}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </Link>
      </figure>
      <div className="card-body">
        <Link href={`/product/${product.slug}`}>
          <h2 className="card-title font-normal">{product.name}</h2>
        </Link>
        <Rating value={product.rating} caption={`(${product.numReviews})`} />
        <p className="mb-2">{product.brand}</p>
        <div className="card-actions flex items-center justify-between">
          <span className="text-2xl">₹{product.price}</span>
        </div>
      </div>
    </div>
  )
}
