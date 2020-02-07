import { validationMixin } from 'vuelidate'
import { mask } from 'vue-the-mask'
import { required, email, minLength } from 'vuelidate/lib/validators'
import cpfGenerator from '@fnando/cpf/dist/node'
import moment from 'moment-timezone'
moment.tz.setDefault('America/Sao_Paulo')
moment.locale('pt-BR')

export default {
  name: 'person-form',
  mixins: [validationMixin],
  directives: {
    mask
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
          street: '',
          cellphone: '',
          address: [],
          contact: []
        }
      }
    },
    isReadOnly: {
      type: Boolean,
      default: false
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
      // street: {
      //   required
      // },
      // cellphone: {
      //   required
      // }
      // address: this.rulesAddress,
      // contact: this.rulesContact
    }
  },
  computed: {
    rulesAddress () {
      const fields = ['street', 'cep', 'neighborhood', 'city', 'uf']

      const validation = {}
      fields.forEach((field) => {
        const obj = {}
        obj[field] = {
          required,
          minLength: minLength(3)
        }

        Object.assign(validation, obj)
      })

      return {
        $each: validation
      }
    },
    rulesContact () {
      const fields = ['cellphone']

      const validation = {}
      fields.forEach((field) => {
        const obj = {}
        obj[field] = {
          required
        }

        Object.assign(validation, obj)
      })

      return {
        $each: validation
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
      if (this.$v.$invalid) {
        return
      }

      // eslint-disable-next-line no-console
      console.log('entrou aqui: ' + JSON.stringify(this.person))
    },
    clear () {
      Object.keys(this.person).forEach((key) => {
        let value = this.person[key]
        if (Array.isArray(value)) {
          value = []
        } else {
          value = ''
        }

        this.person[key] = value
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
