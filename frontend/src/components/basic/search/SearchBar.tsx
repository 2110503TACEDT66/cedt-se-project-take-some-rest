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
      <button className='bg-cgr-dark-green px-3 rounded-lg text-white m-0 p-0'>
        <i className='bi bi-search text-2xl'></i>
      </button>
    </div>
  )
}
