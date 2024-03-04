'use client'
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

export const SearchBox = () => {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || 'All'

  const { data: categories, error } = useSWR('/api/products/categories')

  if (error) return error.message
  if (!categories)
    return (
      <div
        className="search-box"
        style={{
          animation: 'fade-in 0.5s ease-out',
          opacity: 0,
          transition: 'opacity 0.5s ease-out',
        }}
      >
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-start">
          <select
            name="category"
            defaultValue={category}
            className="md:mr-2 mb-2 md:mb-0 select select-bordered"
          >
            <option value="all">All</option>
          </select>
          <input
            className="md:mr-2 mb-2 md:mb-0 input input-bordered w-full md:w-48"
            placeholder="Search"
            defaultValue={q}
            name="q"
            style={{ boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)' }}
          />
          <button
            className="btn"
            style={{ animation: 'glow 1.5s infinite alternate' }}
          >
            Search
          </button>
        </div>
      </div>
    )

  return (
    <form action="/search" method="GET" className="search-box">
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
          style={{
            animation: 'slide-in 0.5s forwards',
            boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)',
          }}
        />
        <button
          className="btn"
          style={{ animation: 'glow 1.5s infinite alternate' }}
        >
          Search
        </button>
      </div>
    </form>
  )
}
