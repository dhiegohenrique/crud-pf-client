import { validationMixin } from 'vuelidate'
import { mask } from 'vue-the-mask'
import { required, email, minLength } from 'vuelidate/lib/validators'
import cpfGenerator from '@fnando/cpf/dist/node'
import AddressForm from '@/components/address-form/index'
import Contact from '@/components/contact/index'
import moment from 'moment-timezone'
import personMixin from '@/shared/mixins/person.mixin'

export default {
  name: 'person-form',
  mixins: [
    validationMixin,
    personMixin
  ],
  directives: {
    mask
  },
  components: {
    AddressForm,
    Contact
  },
  props: {
    showCancel: {
      type: Boolean,
      default: false
    },
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
      invalidContact: [],
      hasInvalidAddress: false,
      hasInvalidContact: false,
      originalPerson: {}
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
    async savePerson () {
      this.$root.$emit('showLoading')

      this.$v.$touch()
      const isValid = !this.$v.$invalid
      const { isValidAddress, isValidContact } = await this.validateComponents()

      this.invalidAddress = this.getInvalidIndex(isValidAddress)
      this.invalidContact = this.getInvalidIndex(isValidContact)
      this.hasInvalidAddress = this.invalidAddress.length
      this.hasInvalidContact = this.invalidContact.length

      if (!isValid || this.hasInvalidAddress || this.hasInvalidContact) {
        this.$root.$emit('hideLoading')
        return
      }

      const person = this._.cloneDeep(this.person)

      person.cpf = person.cpf.replace(/\D/g, '')
      person.address = person.address.map((address) => {
        address.cep = address.cep.replace(/\D/g, '')
        return address
      })
      person.birthDate = moment(person.birthDate, 'DD/MM/YYYY')

      try {
        let res
        if (!person._id) {
          person.contact = person.contact.map((contact) => {
            return contact.cellphone.replace(/\D/g, '')
          })

          res = await this.insert(person)
          this.$root.$emit('showToast', 'Pessoa cadastrada com sucesso.')
          this.cancel()
        } else {
          res = await this.update(person)
          this.$root.$emit('showToast', 'Pessoa atualizada com sucesso.')
        }

        if (res.data._id) {
          person._id = res.data._id
        }

        this.clear()
        this.$emit('save', person)
      } finally {
        this.$root.$emit('hideLoading')
      }
    },
    validateComponents () {
      return new Promise((resolve) => {
        const isValidAddress = []
        const isValidContact = []

        const keys = Object.keys(this.$refs)
        const arrayPromises = []

        keys.forEach((ref) => {
          let component = this.$refs[ref]
          if (Array.isArray(component)) {
            component = component[0]
          }

          if (component && component.$options._componentTag.includes('address-form')) {
            const validate = component.validate
            if (validate) {
              arrayPromises.push(validate())
            }
          } else if (component && component.$options._componentTag.includes('contact')) {
            const validate = component.validate
            if (validate) {
              isValidContact.push(validate())
            }
          }
        })

        Promise.all(arrayPromises)
          .then((res) => {
            isValidAddress.push(...res)
            resolve({
              isValidAddress,
              isValidContact
            })
          })
          .finally(() => {
          })
      })
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
      this.invalidAddress = []
      this.invalidContact = []
      this.hasInvalidAddress = false
      this.hasInvalidContact = false

      Object.keys(this.person).forEach((key) => {
        if (!(key === 'address' || key === 'contact')) {
          this.person[key] = ''
        }
      })

      this.$v.$reset()

      const tags = ['address-form', 'contact']
      Object.keys(this.$refs).forEach((ref) => {
        let component = this.$refs[ref]
        if (Array.isArray(component)) {
          component = component[0]
        }

        if (component && tags.includes(component.$options._componentTag)) {
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
    },
    cancel () {
      this.clear()
      this.$emit('cancel')
    }
  }
}
