export default function Tag({
  children,
  size,
}: {
  children: React.ReactNode
  size?: string
}) {
  if (!size) size = 'md'

  return (
    <div className={`border rounded-md px-4 py-1`}>
      <p className={`text-cgr-gray-60 text-${size} flex flex-row gap-1`}>
        {children}
      </p>
    </div>
  )
}
