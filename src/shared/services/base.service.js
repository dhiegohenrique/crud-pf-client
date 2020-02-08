import axios from 'axios'
import Vue from 'vue'

const showToast = () => {
  const message = 'Ocorreu um erro. Tente novamente mais tarde.'
  Vue.toasted.clear()
  Vue.toasted.show(message, {
    icon: 'warning',
    duration: 10000,
    action: {
      icon: 'close',
      onClick: (e, toastObject) => {
        toastObject.goAway(0)
      }
    },
    className: 'toast'
  })
}

class BaseService {
  static instance = null

  static getInstance () {
    if (BaseService.instance == null) {
      BaseService.instance = new BaseService()
    }
    return BaseService.instance
  }

  constructor () {
    this.client = this.getClient()
  }

  getClient () {
    const client = axios.create({
      baseURL: process.env.VUE_APP_URL_API,
      timeout: 60000
    })

    client.interceptors.response.use((response) => {
      return response
    }, (error) => {
      showToast()
      return Promise.reject(error)
    })

    return client
  }

  get (url) {
    return this.client.get(url)
  }

  post (url, data) {
    return this.client.post(url, data)
  }

  put (url, data) {
    return this.client.put(url, data)
  }

  delete (url) {
    return this.client.delete(url)
  }
}
export default () => {
  return BaseService.getInstance()
}
