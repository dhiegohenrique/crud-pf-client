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
      baseURL: '',
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
}
export default () => {
  return BaseService.getInstance()
}
