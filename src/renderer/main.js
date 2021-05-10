import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

// import VueMaterial from 'vue-material'
import { MdIcon, MdButton, MdDialog, MdField, MdLayout, MdTabs, MdSnackbar, MdSwitch, MdContent } from 'vue-material/dist/components'

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default-dark.css' // This line here

require('electron-disable-file-drop')

Vue.use(MdIcon)
Vue.use(MdDialog)
Vue.use(MdButton)
Vue.use(MdField)
Vue.use(MdLayout)
Vue.use(MdTabs)
Vue.use(MdSnackbar)
Vue.use(MdSwitch)
Vue.use(MdContent)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
