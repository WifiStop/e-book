import {computerShowSize,getBookSize,getBookContainerSize,getMaxSize} from '@/share/utils'
const SHOW_ONCE_PAGE_WIDTH = 1000

const pcBookModule = {
    state: () => ({
        scale:'' ,// 宽 / 高 = scale
        isShowOncePage:false,
        bookContainer:{
            width:1,
            height:1,
            maxWidth:1,
            maxHeight:1
        },
        book:{
            width:1,
            height:1,
        },
        fired:null

    }),
    mutations: {
        setFired(state,value){
            state.fired = value
        },
        setScale(state,value){
            state.scale = value.scale
            computerShowSize(JSON.parse(JSON.stringify(state)),this.commit.bind(this,'pcBook.store/setBook'))
        },
        setIsShowOncePage(state,value){
            state.isShowOncePage = value
        },
        setBookContainer(state){
            const {curWidth,curHeight} = getMaxSize()
            const bookContainer = {}
            bookContainer.maxWidth = bookContainer.width = curWidth
            bookContainer.maxHeight = bookContainer.height = curHeight
            state.bookContainer = bookContainer
            this.commit('pcBook.store/setIsShowOncePage',bookContainer.maxWidth < SHOW_ONCE_PAGE_WIDTH)
            computerShowSize(JSON.parse(JSON.stringify(state)),this.commit.bind(this,'pcBook.store/setBook'))
        },
        setBookContainerW(state,value){
            state.bookContainer.width = value
        },
        setBookContainerMaxH(state,value){
            state.bookContainer.height = value
        },
        setBook(state,value){
            
            state.book = value
        }
    },
    actions: {},
    getters: {
        bookSize(state){
            return getBookSize(state)
        },
        bookShadow(state){
            return function(curPage,maxPage){
                if(curPage==='0' || Number(curPage)==maxPage){
                    const style = {
                        ...getBookSize(state),
                        left:state.book.width/2 + 'px'
                      }
                      return style
                      
                }
                const style = {
                    ...getBookContainerSize(state),
                    left:'0px'
                  }
                  return style
            }
            
        },
        specialStyle(state){
            return function(curPage,maxPage){
               const {book} = state
                if(curPage === '0'){
                    return {
                        left:-(book.width / 2) + 'px',
                    }
                  }else if(curPage == maxPage){
                    return {
                        left:(book.width / 2) + 'px',
                    }
                  }else {
                    return {
                        left:'0px'
                    }
                  }
            }
        },
        container(state){
            return getBookContainerSize(state)
        },
    }
}

export default pcBookModule