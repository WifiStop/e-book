
import App from './App.vue'
import less from 'less'
import '@/assets/style/index.less'
import store from '@/store/index.store'
import {pageSizeListener} from '@/share/utils'
import router from '@/routes/index'

pageSizeListener(store)
Vue.use(less)

Vue.config.productionTip = false
Vue.use(ELEMENT);

new Vue({
  el:'#app',
  store,
  router,
  render: h => h(App),
})
