import React, { useState, useEffect } from 'react'

const Authors = ({ show, result, editBorn }) => {
  const [author, setAuthor] = useState('')
  const [born, setBorn] = useState('')
  
  useEffect(() => {
    if (result.loading) return
    result.data && setAuthor(result.data.allAuthors[0].name)
  }, [result])

  if (!show) return null
  if (result.loading) return <div>Loading...</div>

  const authors = result.data.allAuthors

  const submit = (event) => {
    event.preventDefault()
    
    editBorn({ variables: { author, setBornTo: Number(born) }})

    setAuthor('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <br/>
      <form onSubmit={submit}>
        <div>
          Select author
          <select value={author} onChange={({ target }) => setAuthor(target.value)}>
            {authors.map(author => {
              return <option key={author.name} value={author.name}>{author.name}</option>
            })}
          </select>
        </div>
        <div>
          born to
          <input
              type='number'
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
        </div>
        <button type='submit'>Submit</button>
      </form>

    </div>
  )
}

export default Authors