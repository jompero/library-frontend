import React, { useState } from 'react'

const Authors = ({ show, result, editBorn }) => {
  const [author, setAuthor] = useState('')
  const [born, setBorn] = useState('')

  if (!show || result.loading) {
    return null
  }

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