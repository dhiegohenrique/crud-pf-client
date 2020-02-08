import PersonForm from '@/components/person-form/index'
import personMixin from '@/shared/mixins/person.mixin'
import VMasker from 'vanilla-masker'
import moment from 'moment-timezone'
moment.tz.setDefault('America/Sao_Paulo')

export default {
  name: 'home',
  components: {
    PersonForm
  },
  mixins: [
    personMixin
  ],
  data () {
    return {
      people: [],
      headers: [
        { text: 'Criado em', value: 'creationDate', sortable: false, align: 'center', search: false },
        { text: 'Nome', value: 'name', sortable: false, search: true },
        { text: 'CPF', value: 'cpf', sortable: false, search: false },
        { text: 'Nascimento', value: 'birthDate', sortable: false, search: false },
        { text: 'E-mail', value: 'email', sortable: false, search: false }
      ],
      notData: 'Nenhum registro',
      notFound: 'Nenhum resultado encontrado',
      searchValue: ''
    }
  },
  computed: {
    formattedPeople () {
      let items
      if (!this.searchValue || this.searchValue.length < 3) {
        items = this.people
      } else {
        items = this.searchItem()
      }

      return items.map((person) => {
        const { _id, creationDate, name, cpf, email, birthDate } = person
        return {
          _id,
          creationDate: moment(creationDate).format('DD/MM/YYYY HH:mm'),
          name,
          cpf: VMasker.toPattern(cpf, '999.999.999-99'),
          birthDate: moment(birthDate).format('DD/MM/YYYY HH:mm'),
          email
        }
      })
    }
  },
  async mounted () {
    try {
      this.$root.$emit('showLoading')
      const res = await this.get()
      this.people = res.data
    } finally {
      this.$root.$emit('hideLoading')
    }
  },
  methods: {
    save (data) {
      // eslint-disable-next-line no-console
      console.log('save: ' + JSON.stringify(data))
    },
    searchItem () {
      const search = this.normalizeValue(this.searchValue)

      return this.people.filter((person) => {
        const name = this.normalizeValue(person.name)
        return name.includes(search)
      })
    },
    normalizeValue (value) {
      value = String(value)
      value = value.toLowerCase().trim()
      return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    }
  }
}
