'use client'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

export const SearchBox = () => {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'All'

  const { data: categories, error } = useSWR('/api/products/categories')

  if (error) return error.message
  if (!categories) return 'Loading...'

  return (
    <form action="/search" method="GET">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-start">
        <select
          name="category"
          defaultValue={category}
          className="md:mr-2 mb-2 md:mb-0 select select-bordered"
        >
          <option value="all">All</option>
          {categories.map((c: string) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          className="md:mr-2 mb-2 md:mb-0 input input-bordered w-full md:w-48"
          placeholder="Search"
          defaultValue={q}
          name="q"
        />
        <button className="btn">Search</button>
      </div>
    </form>
  )
}
