import { API } from "./auth"
import { useState } from "react"
import { useEffect } from "react"


interface User{
    id: Number,
    first: string,
    last: string,
    email: string,
    devices: Array<string>
}

export default function getUser()
{
    const [me, setMe] = useState<User | null>(null)

    useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    API.get('/users/getUser')
        .then(res => setMe(res.data))
        .catch(() => {
        localStorage.removeItem('token')
        setMe(null)
        })
    }, [])

    return me;
}

