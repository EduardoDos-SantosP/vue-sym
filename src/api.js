import axios from "axios";

export const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    validateStatus: status => true,
    headers: {
        get Authorization() {
            const h = localStorage.getItem('token') ?? undefined
            console.log(h)
            return h
        }
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