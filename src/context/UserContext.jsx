import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext({});

export const UserProvider = (props) => {
    const [user, setUser] = useState(null)

    useEffect(()=> {
        const loggedInUser = localStorage.getItem("user")
        if (loggedInUser){
            const foundUser = JSON.parse(loggedInUser)
            setUser(foundUser)
        }
    }, [])

    return (

        <UserContext.Provider value={[user, setUser]}>
            {props.children}
        </UserContext.Provider>
    )
}