import BaseMixin from './base.mixin'

const mixin = {
  mixins: [
    BaseMixin
  ],
  data () {
    return {
      urlPerson: '/person'
    }
  },
  methods: {
    insert (person) {
      return this.requestPost(this.urlPerson, person)
    },
    update (person) {
      return this.requestPut(this.urlPerson, person)
    },
    delete (_id) {
      return this.requestDelete(`${this.urlPerson}/${_id}`)
    },
    get (_id) {
      let url = this.urlPerson
      if (_id) {
        url += `/${_id}`
      }

      return this.requestGet(url)
    }
  }
}

export default mixin
