import moment from 'moment-timezone'
moment.locale('pt-BR')

const mixin = {
  methods: {
    getFormattedDateHour (date) {
      return moment(date).format('dddd, DD/MM/YYYY HH:mm:ss').toLowerCase()
    },
    getFormattedHour (date) {
      return moment.unix(date).tz('America/Sao_Paulo').format('HH:mm')
    },
    getFormattedDay (date) {
      return moment(date).format('dddd, DD/MM/YYYY').toLowerCase()
    },
    getFormattedDate (date) {
      return moment(date).format('DD/MM/YYYY')
    }
  }
}

export default mixin
