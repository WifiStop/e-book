import Vuex from 'vuex'


Vue.use(Vuex)

const modules = {}
const files = require.context('./modules', true, /\.js$/) // 引入对应的资源

files.keys().forEach(path => {
  const module = files(path).default || {} 
  modules[path.slice(2, -3)] = { 
    namespaced: true,
    ...module
  }
})
console.log(modules)
const store = new Vuex.Store({
  modules,
    state: {
     
    },
    mutations: {
      
    }
  })

  export default store
