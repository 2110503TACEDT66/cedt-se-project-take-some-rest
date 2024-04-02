'use client'

import { useEffect, useState } from 'react'

export default function SortButton({ setFilter }: { setFilter: Function }) {
  // status 0 = mean not sort
  // status 1 = mean sort ASC
  // status 2 = mean sort DESC
  const [status, setStatus] = useState(0)
  const [textForShowing, settextForShowing] = useState(
    <i className='bi bi-sort-down text-cgr-dark-green'></i>
  )

  useEffect(() => {
    if (status == 0) {
      settextForShowing(<i className='bi bi-sort-down text-cgr-dark-green'></i>)
    } else if (status == 1) {
      settextForShowing(
        <i className='bi bi-sort-alpha-down text-cgr-dark-green'></i>
      )
    } else if (status == 2) {
      settextForShowing(
        <i className='bi bi-sort-alpha-up text-cgr-dark-green'></i>
      )
    } else {
      setStatus(0)
      settextForShowing(<i className='bi bi-sort-down text-cgr-dark-green'></i>)
    }
  }, [status])

  return (
    <button
      className='w-[60px] h-[48px] rounded-lg border border-cgr-dark-green border-2 bg-white flex items-center justify-center'
      onClick={() => setStatus((status + 1) % 3)}>
      {textForShowing}
    </button>
  )
}
