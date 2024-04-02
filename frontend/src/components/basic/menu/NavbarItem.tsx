import Link from 'next/link'

export default function NavbarItem({
  children,
  path,
}: {
  children: React.ReactNode
  path: string
}) {
  return (
    <Link
      href={path}
      className='text-md font-normal text-black mx-5 hover:text-lg hover:text-cgr-black duration-200'>
      {children}
    </Link>
  )
}
