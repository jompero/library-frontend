import React, { useState } from 'react'

const LoginForm = ({ show, login, setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    if (!show) return null

    const submit = async (event) => {
        event.preventDefault()
        const result = await login({
            variables: { username, password }
        })
        
        if (result) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('libraryToken', token)
        }
    }

    return (
        <form onSubmit={submit}>
            <div>
                <label>Username</label>
                <input value={username} onChange={(event) => setUsername(event.target.value)}/>
            </div>
            <div>
                <label>Password</label>
                <input type='password' value={password} onChange={(event) => setPassword(event.target.value)} />
            </div>
            <button type='submit'>Login</button>
        </form>
    )
}

export default LoginForm