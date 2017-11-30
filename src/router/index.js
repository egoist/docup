import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home.vue'

Vue.use(Router)

export default opts => new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
      props: { opts }
    }
  ]
})
