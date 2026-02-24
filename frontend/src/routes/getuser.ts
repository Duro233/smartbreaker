import { API } from "./auth"
import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"


interface User{
    id?: Number,
    userID?: Number,
    first: string,
    last: string,
    email: string,
    devices?: Array<string>,
    regDevices?: Array<string>
}

export default function getUser()
{
    const [me, setMe] = useState<User | null>(null)

    useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) 
        window.location.href = '/login'; // reroute to login page when no token present (will likely change to home page)

    API.get('/users/getUser')
        .then(res => setMe(res.data))
        .catch((error) => {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;

        console.log(status);
        // Only clear local token on actual auth failures.
        if(status === 401 || status === 403)
        {
            localStorage.removeItem('token');
            window.location.href = '/login'; // reroute to login page when token error occurs (will likely change to home page)
        }

        setMe(null);
        })
    }, [])

    console.log(me);
    return me;
}

