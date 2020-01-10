import React, { useEffect } from 'react'

const Recommended = ({ show, getRecommendedBooks, recommendedBooks, me }) => {
    useEffect(() => {
        console.log(me)
        if (me.loading || !me.data.me) return
        getRecommendedBooks({ variables: { genre: me.data.me.favoriteGenre}})
    }, [me, getRecommendedBooks, show])

    console.log('me', me)
    console.log('recommendedbooks', recommendedBooks)
    if (!show) return null
    recommendedBooks.refetch()
    if (!recommendedBooks.data || recommendedBooks.loading) return <div>Loading...</div>

    return (
        <div>
            <div>{me.data.me.username}</div>
            <div>{me.data.me.favoriteGenre}</div>
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
                        {recommendedBooks.data.allBooks.map(a => {
                            return (
                                <tr key={a.title}>
                                    <td>{a.title}</td>
                                    <td>{a.author.name}</td>
                                    <td>{a.published}</td>
                                </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default Recommended