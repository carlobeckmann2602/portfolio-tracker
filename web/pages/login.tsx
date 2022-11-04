import type { NextPage } from 'next'

const Login: NextPage = () => {
    return (
        <>
            <h1>Login</h1>
            <form
                onSubmit={(event) => {
                    event.preventDefault()
                    console.log('login form submitted')
                }}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" />
                <button type="submit">Login</button>
            </form>
        </>
    )
}

export default Login
