const computerScale = ()=>{
    let isFirst = true;
    return (imgElement,callback)=>{
        if(isFirst){
            isFirst = false
            const curWidth = imgElement.naturalWidth;
			const curHeight = imgElement.naturalHeight;
            const scale = curWidth/curHeight
            callback({scale,curWidth,curHeight})
        }
    }
}

const computerImageShowSize = (state,callback)=>{
    
    let {bookContainer,scale} = state
    if(!scale) return
    const evenNumber = Math.floor(bookContainer.width / 2)
    const width = evenNumber%2==1?evenNumber+1:evenNumber
    state.book = {
        width,
        height:Math.ceil(width / scale)
    }
  
    checkLimit(state,callback)
    callback(state.book)
}

const checkLimit = (state,callback)=>{
    const {bookContainer,book} = state
    if(book.height > bookContainer.maxHeight){
        bookContainer.width = bookContainer.width - 20
        computerImageShowSize(state,callback)
    }
}
const getScale = computerScale()

const getBookSize = (state)=>{
    const style = {
        width:state.book.width+ 'px',
        height:state.book.height + 'px'
      }
      return style
}
const getBookContainerSize = (state)=>{
    const style = {
        width:state.book.width*2+ 'px',
        height:state.book.height + 'px'
      }

      return style
}
export {
    getScale,
    computerImageShowSize,
    getBookSize,
    getBookContainerSize
}