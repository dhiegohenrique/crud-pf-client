import BaseService from '@/shared/services/base.service'

const mixin = {
  data () {
    return {
      baseService: BaseService()
    }
  },
  methods: {
    requestGet (url) {
      return this.baseService.get(url)
    },
    requestPost (url, data) {
      return this.baseService.post(url, data)
    },
    requestPut (url, data) {
      return this.baseService.put(url, data)
    },
    delete (url) {
      return this.baseService.delete(url)
    }
  }
}

export default mixin
