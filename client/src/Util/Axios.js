import axios from 'axios'

const axiosOBJ = axios.create({
    baseURL:"http://localhost:4000"
})

export default axiosOBJ;