import { MenuOutlined } from '@ant-design/icons'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Menu from './Menu'
import { SearchBox } from './SearchBox'

const Header = () => {
  return (
    <header>
      <nav>
        <div className="navbar justify-between bg-base-300">
          <div>
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <MenuOutlined className="inline-block w-5 h-5" />
            </label>
            <Link href="/" className="btn btn-ghost text-lg">
              <Image src="/images/logo.png" alt="logo" width={50} height={40} />
              WeaveWagon
            </Link>
          </div>
          <Menu />
        </div>
        <div className="bg-base-300 block md:hidden text-center pb-3">
          <SearchBox />
        </div>
      </nav>
    </header>
  )
}

export default Header
