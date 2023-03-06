import React from 'react';
import Header from '../application/Header';
import Login from './Login';
import CreateAccount from './CreateAccount';

function Auth () {
    return (
        <>
            <Header page_name='View Your Home' user_first_name=''/>
            <Login />
            <CreateAccount />
        </>
    )
}

export default Auth;
