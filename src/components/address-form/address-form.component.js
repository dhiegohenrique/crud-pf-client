import { validationMixin } from 'vuelidate'
import { mask } from 'vue-the-mask'
import { required, minLength } from 'vuelidate/lib/validators'
import cepMixin from '@/shared/mixins/cep.mixin'
import stateMixin from '@/shared/mixins/state.mixin'
import moment from 'moment-timezone'
moment.tz.setDefault('America/Sao_Paulo')
moment.locale('pt-BR')

export default {
  name: 'address-form',
  mixins: [
    validationMixin,
    cepMixin,
    stateMixin
  ],
  directives: {
    mask
  },
  props: {
    address: {
      type: Object,
      default: () => {
        return {
          street: '',
          cep: '',
          neighborhood: '',
          birthDate: '',
          city: '',
          uf: ''
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
      stateAcronyms: []
    }
  },
  validations: {
    address: {
      street: {
        required,
        minLength: minLength(3)
      },
      cep: {
        required,
        valid: async function (value) {
          if (value.length < 9) {
            return true
          }

          let isValid
          try {
            this.$root.$emit('showLoading')
            isValid = await this.isValidCep(value)
          } finally {
            this.$root.$emit('hideLoading')
          }

          return isValid
        }
      },
      neighborhood: {
        required,
        minLength: minLength(3)
      },
      city: {
        required,
        minLength: minLength(3)
      },
      uf: {
        required
      }
    }
  },
  mounted () {
    this.stateAcronyms = this.getStateAcronyms()
  },
  methods: {
    getStreetErrors () {
      const errors = []
      if (!this.$v.address.street.$dirty) {
        return errors
      }

      if (!this.$v.address.street.required) {
        errors.push('Insira o logradouro')
      }

      if (!this.$v.address.street.minLength) {
        errors.push('Insira pelo menos 3 caracteres')
      }

      return errors
    },
    getCepErrors () {
      const errors = []
      if (!this.$v.address.cep.$dirty) {
        return errors
      }

      if (!this.$v.address.cep.required) {
        errors.push('Insira o CEP')
      }

      if (!this.$v.address.cep.valid) {
        errors.push('Insira um CEP válido')
      }

      return errors
    },
    getNeighborhoodErrors () {
      const errors = []
      if (!this.$v.address.neighborhood.$dirty) {
        return errors
      }

      if (!this.$v.address.neighborhood.required) {
        errors.push('Insira o bairro')
      }

      if (!this.$v.address.neighborhood.minLength) {
        errors.push('Insira pelo menos 3 caracteres')
      }

      return errors
    },
    getCityErrors () {
      const errors = []
      if (!this.$v.address.city.$dirty) {
        return errors
      }

      if (!this.$v.address.city.required) {
        errors.push('Insira a cidade')
      }

      if (!this.$v.address.city.minLength) {
        errors.push('Insira pelo menos 3 caracteres')
      }

      return errors
    },
    getUfErrors () {
      const errors = []
      if (!this.$v.address.uf.$dirty) {
        return errors
      }

      if (!this.$v.address.uf.required) {
        errors.push('Insira o estado')
      }

      return errors
    },
    validate () {
      this.$v.$touch()
      // eslint-disable-next-line no-console
      console.log('entrou aqui')
      return !this.$v.$invalid
    },
    clear () {
      Object.keys(this.address).forEach((key) => {
        let value = this.address[key]
        if (Array.isArray(value)) {
          value = []
        } else {
          value = ''
        }

        this.address[key] = value
      })

      this.$v.$reset()
    },
    validateLength (event, length) {
      if (event.target.value.length !== length) {
        event.target.value = ''
        event.target.dispatchEvent(new Event('input'))
      }
    }
  }
}
