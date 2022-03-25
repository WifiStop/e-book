import {generate} from 'shortid'

const once = (callback)=>{
    let isFirst = true
    return (...args)=>{
        if(isFirst){
            isFirst = false
            callback(...args)
        }
    }
}

const throttle = (callback,time)=>{
    let timer = null;
    let pending = false
    return (...args)=>{
        if(pending) return
        pending = true
        timer = setTimeout(()=>{
            callback(...args)
            pending = false
        },time)
    }
}


const onTurn = once((book)=>{
   setTimeout(()=>{
    $("#flipbook").turn({
        autoCenter: true,
        height:book.height,
        width:book.width * 2,
        });
   },0)
    
  })
  const getEmptyPage = (type)=>{
    return {
      type,
      svgName: "",
      hoverData: [],
      key:generate()
    };
  }
export {
    throttle,
    onTurn,
    once,
    getEmptyPage
}