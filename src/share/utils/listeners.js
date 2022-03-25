
import {throttle} from '@/share/utils'
const pageSizeListener = (store)=>{
    const watchWindowSize = throttle(()=>{
        store.commit('pcBook.store/setBookContainer')
    },200)
    window.addEventListener("resize", watchWindowSize);
    return watchWindowSize
}

export {
    pageSizeListener
}