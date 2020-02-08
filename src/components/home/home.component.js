import PersonForm from '@/components/person-form/index'

export default {
  name: 'home',
  components: {
    PersonForm
  },
  methods: {
    save (data) {
      // eslint-disable-next-line no-console
      console.log('save: ' + JSON.stringify(data))
    }
  }
}
