import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    validateStatus: status => true,
    /*headers: {
        get Authorization() {
            const token = localStorage.getItem('token') ?? undefined
            console.log({token})
            return token
        }
    },*/
    transformRequest: (data, headers) => {
        const token = localStorage.getItem('token') ?? undefined
        console.log({token})
        headers.Authorization = token
        return JSON.stringify(data)
    },
    transformResponse: (data, headers, status) => {
        data = JSON.parse(data)
        if (status >= 400) {
            console.log(status, data, headers)
            if (status < 500)
                alert('O recurso não existe ou você não tem permissão')
        }
        return data
    }
})