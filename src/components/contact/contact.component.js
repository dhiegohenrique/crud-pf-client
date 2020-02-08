import { validationMixin } from 'vuelidate'
import { mask } from 'vue-the-mask'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'contact',
  mixins: [
    validationMixin
  ],
  directives: {
    mask
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
          if (value.length < 13) {
            return true
          }

          value = value.replace(/\D/g, '')
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
      if (event.target.value.length < 13) {
        event.target.value = ''
        event.target.dispatchEvent(new Event('input'))
      }
    }
  }
}
