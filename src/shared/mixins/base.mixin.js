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
    }
  }
}

export default mixin
