export default {
  name: 'toast',
  mounted () {
    this.$root.$on('showToast', (message) => {
      this.$toasted.show(message, {
        icon: 'success',
        duration: 5000,
        action: {
          icon: 'close',
          onClick: (e, toastObject) => {
            toastObject.goAway(0)
          }
        },
        className: 'toast'
      })
    })
  }
}
