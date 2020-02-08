import cepPromise from 'cep-promise'

const mixin = {
  methods: {
    isValidCep (cep) {
      return new Promise((resolve) => {
        cepPromise(cep)
          .then(() => {
            resolve(true)
          })
          .catch(() => {
            resolve(false)
          })
      })
    }
  }
}

export default mixin
