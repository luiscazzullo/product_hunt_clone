import React, { useEffect, useState } from 'react';
import firebase from '../firebase';
const useAuth = () => {
    const [userAuth, setUserAuth] = useState(null);
    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged(user => {
            if(user) {
                setUserAuth(user)
            } else {
                null
            }
            return () => unsubscribe()
        })
    }, [])
    return userAuth;
}
export default useAuth