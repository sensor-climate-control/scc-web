import React from 'react';
import Header from '../application/Header';
import Login from './Login';
import CreateAccount from './CreateAccount';

function Auth () {
    return (
        <>
            <Header page_name='Login or Create Account' user_first_name=''/>
            <Login />
            <CreateAccount />
        </>
    )
}

export default Auth;
