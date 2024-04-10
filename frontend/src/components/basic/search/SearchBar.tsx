import FilterButton from './FilterButton'

export default function SearchBar() {
  return (
    <div className='w-fill flex flex-row gap-x-4'>
      <input
        type='text'
        className='cgr-search-box placeholder-cgr-dark-green w-full'
        placeholder='Find something...'
      />
      <FilterButton />
    </div>
  )
}
