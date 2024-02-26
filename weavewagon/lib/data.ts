import bcrypt from 'bcryptjs'

const data = {
  users: [
    {
      name: 'WeaveWagon',
      email: 'admin@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: true,
    },
    {
      name: 'User',
      email: 'user@example.com',
      password: bcrypt.hashSync('123456'),
      isAdmin: false,
    },
  ],
  products: [
    {
      name: 'Leather Bind',
      slug: 'leather-bind',
      category: 'Hardcover',
      image: '/images/leather1.jpg',
      price: 1700,
      brand: 'Maple Matts',
      rating: 4.4,
      numReviews: 10,
      countInStock: 100,
      description: 'Beautifully crafted to be smooth and durable',
      isFeatured: true,
      banner: '/images/banner1.jpg',
    },
    {
      name: 'Cathedral',
      slug: 'cathedral',
      category: 'Posters',
      image: '/images/poster-2.jpg',
      price: 1700,
      brand: 'Pilgrims Parol',
      rating: 4.4,
      numReviews: 10,
      countInStock: 100,
      description: 'Beautifully crafted with a touch of grim reality of time',
      isFeatured: true,
      banner: '/images/poster-2.jpg',
    },
    {
      name: 'Trunk Transform',
      slug: 'trunk-transform',
      category: 'Poster',
      image: '/images/poster-1.jpg',
      price: 1700,
      brand: 'Lavender Lock',
      rating: 4.4,
      numReviews: 10,
      countInStock: 100,
      description: 'Beautifully crafted and a peek into a social satire',
      isFeatured: true,
      banner: '/images/poster-1.jpg',
    },
  ],
}

export default data
