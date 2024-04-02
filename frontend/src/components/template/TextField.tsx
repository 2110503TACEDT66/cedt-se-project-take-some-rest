import { TextField } from '@mui/material'

export default function CGRTextField() {
  return (
    <div>
      {/* when use as form */}
      <TextField
        id='outlined-basic'
        label='Text Field'
        variant='outlined'
        InputProps={{ style: { borderRadius: '10px' } }}
      />
      {/* when use as edit */}
      <TextField
        id='outlined-basic'
        label='Text Field'
        variant='outlined'
        defaultValue={'asd'}
        InputProps={{ style: { borderRadius: '10px' } }}
      />
      {/* password form */}
      <TextField
        type='password'
        id='outlined-basic'
        label='Password'
        variant='outlined'
        InputProps={{ style: { borderRadius: '10px' } }}
      />
    </div>
  )
}
