import React, { useEffect, useState } from 'react'

const Books = ({ show, books, genres, getFilteredBooks, filteredBooks }) => {
  const [filter, setFilter] = useState(false)
  const [currentBooks, setBooks] = useState([])
  console.log('filteredBooks', filteredBooks)

  useEffect(() => {
    if (!books.loading && !filter) setBooks(books.data.allBooks)
  }, [books, filter])

  useEffect(() => {
    if (!filteredBooks.loading && filter) setBooks(filteredBooks.data.allBooks)
  }, [filteredBooks, filter])

  if (!show) return null
  if (books.loading) return <div>Loading...</div>
  filter && filteredBooks.refetch && filteredBooks.refetch()

  console.log('dsplayed books', currentBooks)

  const clickHandler = (genre) => {
    genre && getFilteredBooks({ variables: { genre } })
    setFilter(genre ? true : false)
  }

  const genreButtons = () => {
    console.log(genres)
    if (genres.loading) return null
    const buttons = genres.data.allGenres.values.map(genre => {
      return <button key={genre} onClick={() => clickHandler(genre)}>{genre}</button>
    })
    return (
      <div>
        {buttons}
        <button onClick={() => clickHandler(null)} >all</button>
      </div>
    )
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {currentBooks.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <div>
        {genreButtons()}
      </div>
    </div>
  )
}

export default Books