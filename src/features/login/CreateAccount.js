import React, {useEffect, useState} from 'react';

import MyCard from "../application/MyCard";
// import Header from '../application/Header';
import { useCreateAccountMutation } from '../../reduxApi';
import { useStore } from 'react-redux'
import { useNavigate } from 'react-router-dom';

function CreateAccount () {
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ name, setName ] = useState("")
    // const [ phone, setPhone ] = useState("")

    const [triggerCreateAccount, { data, error, isLoading, isSuccess, isUninitialized }] = useCreateAccountMutation()

    const store = useStore()
    const navigate = useNavigate()
    useEffect(() => {
        if (store.getState().token.token) {
            return navigate("/");
        }
        console.log("==== state: ", store.getState().token.token)
    })

    async function handleCreateAccount(e) {
        e.preventDefault();

        triggerCreateAccount({name, email, password})
    }

    const createAccountForm = (
        <form onSubmit={handleCreateAccount}>
            <div>
                <label for="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div>
                <label for="email">Email Address:</label>
                <input
                    type="email"
                    id="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>
            <div>
                <label for="password">Create a Password:</label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            {/* <div>
                <label for="phone">Telephone Number:</label>
                <input
                    type="tel"
                    id="phone"
                    placeholder="123-456-7890"
                    // pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
            </div> */}
            <br />
            <div>
                <input type="submit" value="Create Account" />
            </div>
        </form>
    )

    return (
        <MyCard title="Create Account">

            {(isUninitialized) ? createAccountForm :
                (isLoading) ? (<p>Loading...</p>) :
                (isSuccess) ? (<p>{JSON.stringify(data)}</p>) :
                (<p>{JSON.stringify(error)}</p>)}

        </MyCard>
    )
}

export default CreateAccount;