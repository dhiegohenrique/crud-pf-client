import { validationMixin } from 'vuelidate'
import { mask } from 'vue-the-mask'
import { required, email, minLength } from 'vuelidate/lib/validators'
import cpfGenerator from '@fnando/cpf/dist/node'
import AddressForm from '@/components/address-form/index'
import Contact from '@/components/contact/index'
import moment from 'moment-timezone'

export default {
  name: 'person-form',
  mixins: [validationMixin],
  directives: {
    mask
  },
  components: {
    AddressForm,
    Contact
  },
  props: {
    person: {
      type: Object,
      default: () => {
        return {
          name: '',
          cpf: '',
          email: '',
          birthDate: '',
          address: [
            {
              street: '',
              cep: '',
              neighborhood: '',
              city: '',
              uf: ''
            }
          ],
          contact: [
            {
              cellphone: ''
            }
          ]
        }
      }
    },
    isReadOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeTab: 'address',
      invalidAddress: [],
      invalidContact: []
    }
  },
  validations: {
    person: {
      name: {
        required,
        minLength: minLength(3)
      },
      cpf: {
        required,
        valid: function (value) {
          if (value.length < 14) {
            return true
          }

          return cpfGenerator.isValid(value)
        }
      },
      email: {
        required,
        email
      },
      birthDate: {
        required,
        valid: function (value) {
          if (value.length < 10) {
            return true
          }

          return moment(value, 'DD/MM/YYYY').isValid()
        }
      }
    }
  },
  methods: {
    getNameErrors () {
      const errors = []
      if (!this.$v.person.name.$dirty) {
        return errors
      }

      if (!this.$v.person.name.required) {
        errors.push('Insira o nome')
      }

      if (!this.$v.person.name.minLength) {
        errors.push('Insira pelo menos 3 caracteres')
      }

      return errors
    },
    getEmailErrors () {
      const errors = []
      if (!this.$v.person.email.$dirty) {
        return errors
      }

      if (!this.$v.person.email.required) {
        errors.push('Insira o e-mail')
      }

      if (!this.$v.person.email.email) {
        errors.push('Insira um e-mail válido')
      }

      return errors
    },
    getCpfErrors () {
      const errors = []
      if (!this.$v.person.cpf.$dirty) {
        return errors
      }

      if (!this.$v.person.cpf.required) {
        errors.push('Insira o CPF')
      } else if (!this.$v.person.cpf.valid) {
        errors.push('Insira um CPF válido')
      }

      return errors
    },
    getBirthDateErrors () {
      const errors = []
      if (!this.$v.person.birthDate.$dirty) {
        return errors
      }

      if (!this.$v.person.birthDate.required) {
        errors.push('Insira a data de nascimento')
      } else if (!this.$v.person.birthDate.valid) {
        errors.push('Insira uma data válida')
      }

      return errors
    },
    add () {
      this.$v.$touch()
      const isValid = !this.$v.$invalid
      const isValidAddress = []
      const isValidContact = []

      Object.keys(this.$refs).forEach((ref) => {
        const component = this.$refs[ref][0]
        if (component.$options._componentTag.includes('address-form')) {
          const validate = component.validate
          if (validate) {
            isValidAddress.push(validate())
          }
        } else if (component.$options._componentTag.includes('contact')) {
          const validate = component.validate
          if (validate) {
            isValidContact.push(validate())
          }
        }
      })

      this.invalidAddress = this.getInvalidIndex(isValidAddress, 'address-expansion-')
      this.invalidContact = this.getInvalidIndex(isValidContact, 'contact-expansion-')

      if (!isValid || this.invalidAddress.length || this.invalidContact.length) {
        return
      }

      // eslint-disable-next-line no-console
      console.log('entrou aqui: ' + JSON.stringify(this.person))
    },
    getInvalidIndex (array) {
      const invalidIndex = []
      array.forEach((item, index) => {
        if (!item) {
          invalidIndex.push(index)
        }
      })

      return invalidIndex
    },
    clear () {
      Object.keys(this.person).forEach((key) => {
        let value = this.person[key]
        if (key === 'address') {
        } else if (key === 'contact') {

        } else {
          value = ''
        }

        this.person[key] = value
      })

      this.$v.$reset()

      Object.keys(this.$refs).forEach((ref) => {
        const component = this.$refs[ref][0]
        const tags = ['address-form', 'contact']
        if (tags.includes(component.$options._componentTag)) {
          const clear = component.clear
          if (clear) {
            clear()
          }
        }
      })
    },
    validateLength (event, length) {
      if (event.target.value.length !== length) {
        event.target.value = ''
        event.target.dispatchEvent(new Event('input'))
      }
    },
    newAddress () {
      this.person.address.push({
        street: '',
        cep: '',
        neighborhood: '',
        city: '',
        uf: ''
      })
    },
    newContact () {
      this.person.contact.push({
        cellphone: ''
      })
    },
    removeAddress ($event, index) {
      this.person.address.splice(index, 1)
      $event.stopPropagation()
    },
    removeContact ($event, index) {
      this.person.contact.splice(index, 1)
      $event.stopPropagation()
    }
  }
}
