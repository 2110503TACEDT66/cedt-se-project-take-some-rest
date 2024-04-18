'use client'

import SuspenseUI from '@/components/basic/SuspenseUI'
import deleteLog from '@/libs/log/deleteLog'
import getLogs from '@/libs/log/getLogs'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import NoPermissionUI from '@/components/basic/NoPermissionUI'

export default function LogsTable() {
  const { data: session } = useSession()
  if (!session || !session.user.token || session.user.role !== 'admin')
    return <NoPermissionUI />

  const [logs, setLogs] = useState<LogItem[]>([])
  const [isReady, setIsReady] = useState(false)
  const [query, setQuery] = useState('')

  const fetchData = async () => {
    setIsReady(false)
    var queryString = query.length != 0 ? `user=${query}` : ''
    const logsFromFetch: LogItem[] = (
      await getLogs(session.user?.token, queryString)
    ).data
    setLogs(logsFromFetch)
    setIsReady(true)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <main className='bg-cgr-gray-10 p-16 w-screen min-h-screen'>
      <h1 className='text-cgr-black text-4xl font-bold mb-4'>Logs</h1>
      <div className='flex flex-row flex-wrap justify-start items-baseline space-x-3 space-y-2 mb-8 w-full'>
        <div className='flex flex-row w-full md:w-fit space-x-3'>
          <input
            type='text'
            className='cgr-search-box placeholder-cgr-dark-green w-full'
            placeholder='Find something...'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(event.target.value)
            }
          />
          <button
            className='cgr-btn'
            onClick={() => {
              fetchData()
            }}>
            Search
          </button>
        </div>
      </div>
      <table className='cgr-table'>
        <tr className='h-10'>
          <th className='w-4/12'>User id</th>
          <th className='w-3/12'>Accessed at</th>
          <th className='w-1/12'>Type</th>
          <th className='w-2/12'>View user</th>
          <th className='w-2/12'>Delete</th>
        </tr>
        {isReady ? (
          logs.map((obj) => (
            <tr key={obj._id}>
              <td>{obj.user}</td>
              <td>{new Date(obj.accessedAt).toUTCString()}</td>
              <td className='text-center'>{obj.action}</td>
              <td className='text-center'>
                <Link href={`/admin/users/view/${obj.user}`}>
                  <button className='cgr-btn-outline-gray'>View User</button>
                </Link>
              </td>
              <td className='text-center'>
                <button
                  className='cgr-btn-red'
                  onClick={async () => {
                    if (confirm('Please confirm to delete this log')) {
                      await deleteLog(session.user?.token, obj._id)
                      fetchData()
                    }
                  }}>
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5}>
              <SuspenseUI />
            </td>
          </tr>
        )}
      </table>
    </main>
  )
}
