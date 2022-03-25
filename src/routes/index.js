
import VueRouter from 'vue-router'
import BookContainer from '@/view/book-container/bookContainer.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: BookContainer },
]

export default new VueRouter({routes})