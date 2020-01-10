import React, { useEffect, useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery, useMutation, useApolloClient, useLazyQuery, useSubscription } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'

const ALL_AUTHORS = gql`
  {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

const BOOK_DETAILS = gql`
  fragment bookDetails on Book {
    title
    author {
      name
    }
    genres
    published
    id
  }
`

const ALL_BOOKS = gql`
  query allBooks($genre: String){
    allBooks(genre: $genre) {
      ...bookDetails
    }
  }
${BOOK_DETAILS}
`

const ALL_GENRES = gql`
  {
    allGenres {
      values
    }
  }
`

const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      ...bookDetails
    }
  }
${BOOK_DETAILS}
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...bookDetails
    }
  }
${BOOK_DETAILS}
`

const SET_BORN_TO = gql`
  mutation editBorn($author: String!, $setBornTo: Int!) {
    editAuthor(name: $author, setBornTo: $setBornTo) {
      name
      born
    }
  }
`

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const ME = gql`
  {
    me {
      username
      favoriteGenre
    }
  }
`

const App = () => {
  console.log('Rendering app')
  const client = useApolloClient()

  const updateCacheWith = (addedBook) => {
    console.log('client', client)
    console.log('updating cache with new book', addedBook)
    const includedIn = (set, object) => 
      set.map(b => b.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    console.log('data in store', dataInStore)
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      console.log('book not found in cache')
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks: [...dataInStore.allBooks, addedBook] }
      })
      console.log('book cached', client.readQuery({ query: ALL_BOOKS }))
    } else {
      console.log('book already cached')
    }
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData, }) => {
      const addedBook = subscriptionData.data.bookAdded
      console.log('book added', subscriptionData)
      updateCacheWith(addedBook)
      window.alert(`Book ${addedBook.title} added!`)
    }
  })

  const [page, setPage] = useState('authors')
  const [token, setToken] = useState('')
  const me = useQuery(ME)
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const genres = useQuery(ALL_GENRES)
  const [getRecommendedBooks, recommendedBooks] = useLazyQuery(ALL_BOOKS)
  const [getFilteredBooks, filteredBooks] = useLazyQuery(ALL_BOOKS);

  useEffect(() => {
    const token = localStorage.getItem('libraryToken')
    if (token) setToken(token)
  }, [])

  const handleError = (error) => {
    console.log(error)
  }

  const [addBook] = useMutation(CREATE_BOOK, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }],
    update: (store, response) => {
      console.log('prepping for cache', response.data)
      updateCacheWith(response.data.addBook)
    } 
  })

  const [editBorn] = useMutation(SET_BORN_TO, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('recommended')}>recommended</button>}
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {token && <button onClick={() => { 
          localStorage.clear()
          setToken('')
          setPage('authors')
          client.resetStore()
        }}>logout</button>}
      </div>

      <Authors 
        show={page === 'authors'}
        result={authors}
        editBorn={editBorn} />

      <Books
        show={page === 'books'}
        books={books}
        genres={genres}
        getFilteredBooks={getFilteredBooks}
        filteredBooks={filteredBooks}
      />

      <Recommended 
        show={page === 'recommended'}
        me={me}
        getRecommendedBooks={getRecommendedBooks}
        recommendedBooks={recommendedBooks}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

      <LoginForm 
        show={page === 'login'}
        login={login}
        setToken={(token) => {
          setToken(token)
          setPage('authors')
        }}
      />

    </div>
  )
}

export default App