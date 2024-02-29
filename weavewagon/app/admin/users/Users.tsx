'use client'

import { User } from '@/lib/models/UserModel'
import { formatId } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

export default function Users() {
  const { data: users, error } = useSWR(`/api/admin/users`)
  if (error) return 'An error has occurred.'
  if (!users) return 'Loading...'

  return (
    <div>
      <h1 className="py-4 text-2xl">Users</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>email</th>
              <th>admin</th>
              <th>actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: User) => (
              <tr key={user._id}>
                <td>{formatId(user._id)}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'YES' : 'NO'}</td>

                <td>
                  <Link
                    href={`/admin/users/${user._id}`}
                    type="button"
                    className="btn btn-ghost btn-sm"
                  >
                    <EditOutlined />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
