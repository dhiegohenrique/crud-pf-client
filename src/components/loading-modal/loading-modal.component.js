export default {
  name: 'loading-modal',
  data () {
    return {
      showLoading: false
    }
  },
  mounted () {
    this.$root.$on('showLoading', () => {
      this.showLoading = true
    })

    this.$root.$on('hideLoading', () => {
      this.showLoading = false
    })
  }
}
