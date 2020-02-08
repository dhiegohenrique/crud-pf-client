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
        // { text: 'ID', value: '_id', sortable: false, align: 'center', search: false },
        { text: 'Criado em', value: 'creationDate', sortable: false, align: 'center', search: false },
        { text: 'Nome', value: 'name', sortable: false, search: true },
        { text: 'CPF', value: 'cpf', sortable: false, search: false },
        { text: 'Nascimento', value: 'birthDate', sortable: false, search: false },
        { text: 'E-mail', value: 'email', sortable: false, search: false }
      ],
      notData: 'Nenhum registro',
      notFound: 'Nenhum resultado encontrado',
      searchValue: '',
      showAddPerson: false
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
          birthDate: moment(birthDate).format('DD/MM/YYYY'),
          email,
          details: {}
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
    save (person) {
      const index = this.people.findIndex((currentPerson) => {
        return currentPerson._id === person._id
      })

      if (index === -1) {
        this.people.unshift(person)
      } else {
        this.set(this.people, index, person)
      }
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
    },
    async itemExpanded ({ item, value }) {
      if (!value) {
        return
      }

      try {
        this.$root.$emit('showLoading')
        const res = await this.get(item._id)
        item.details = res.data

        item.details.cpf = VMasker.toPattern(item.details.cpf, '999.999.999-99')
        item.details.birthDate = moment(item.details.birthDate).format('DD/MM/YYYY')
        item.details.address = item.details.address.map((address) => {
          address.uf = address.uf.uf
          address.cep = VMasker.toPattern(address.cep, '99999-999')
          return address
        })
        item.details.contact = item.details.contact.map((contact) => {
          contact.cellphone = contact.cellphone.replace(/\D/g, '')
          return contact
        })

        // eslint-disable-next-line no-console
        console.log('item.details: ' + JSON.stringify(item.details))
      } finally {
        this.$root.$emit('hideLoading')
      }
    },
    newPerson () {
      this.showAddPerson = true
    },
    cancel () {
      this.showAddPerson = false
    }
  }
}
