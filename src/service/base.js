import axios from 'axios'

const baseURL = '/'
const ERROR_OK = 0

axios.defaults.baseURL = baseURL

export const get = (url, params) => {
  return axios
    .get(url, {
      params
    })
    .then(res => {
      const serverData = res.data
      if (serverData.code === ERROR_OK) {
        return serverData.result
      }
    })
    .catch(err => {
      console.log(err)
    })
}
