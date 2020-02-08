import { validationMixin } from 'vuelidate'
import { mask as maskDirective } from 'vue-the-mask'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'contact',
  mixins: [
    validationMixin
  ],
  directives: {
    mask: (element, maskOptions) => {
      const el = document.querySelector('.contact .v-text-field__slot input')
      if (el) {
        let value = el.value
        value = value.replace(/\D/g, '')
        if (value.length < 11) {
          maskOptions.value = '(##)####-####'
        } else {
          maskOptions.value = '(##)#####-####'
        }
      }

      if (!maskOptions.value) {
        return
      }

      maskDirective(element, maskOptions)
    }
  },
  props: {
    contact: {
      type: Object,
      default: () => {
        return {
          cellphone: ''
        }
      }
    },
    isReadOnly: {
      type: Boolean,
      default: false
    }
  },
  validations: {
    contact: {
      cellphone: {
        required,
        valid: function (value) {
          if (!(value.length === 10 || value.length === 11)) {
            return false
          }

          const splitNumbers = value.split('')
          const number = splitNumbers[0]
          const sameNumber = splitNumbers.every((currentNumber) => {
            return currentNumber === number
          })

          return !sameNumber
        }
      }
    }
  },
  methods: {
    getCellphoneErrors () {
      const errors = []
      if (!this.$v.contact.cellphone.$dirty) {
        return errors
      }

      if (!this.$v.contact.cellphone.required) {
        errors.push('Insira o celular')
      }

      if (!this.$v.contact.cellphone.valid) {
        errors.push('Insira um celular válido')
      }

      return errors
    },
    validate () {
      this.$v.$touch()
      return !this.$v.$invalid
    },
    clear () {
      Object.keys(this.contact).forEach((key) => {
        this.contact[key] = ''
      })

      this.$v.$reset()
    },
    validateLength (event) {
      if (event.target.value.length < 10) {
        event.target.value = ''
        event.target.dispatchEvent(new Event('input'))
      }
    }
  }
}
