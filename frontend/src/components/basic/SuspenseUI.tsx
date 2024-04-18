import { LinearProgress } from '@mui/material'

export default function SuspenseUI() {
  return (
    <div className='w-full p-32 text-center text-3xl'>
      Loading in progress... <LinearProgress />
    </div>
  )
}
