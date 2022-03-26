
import VueRouter from 'vue-router'
import BookContainer from '@/view/book-containers/bookContainer.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: BookContainer },
]

export default new VueRouter({routes})