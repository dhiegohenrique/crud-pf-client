import HomeComponent from '@/components/home'

const routes = [{
  path: '/',
  component: HomeComponent
}, {
  path: '*',
  redirect: '/'
}]

export default routes
