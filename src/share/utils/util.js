import {generate} from 'shortid'
import store from '@/store/index.store'

let animationTim = null

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
    return function(...args){
        if(pending) return
        pending = true
        timer = setTimeout(()=>{
            callback.call(this,...args)
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
  const isPc = ()=>document.body.clientWidth>1000
  const getMaxSize = ()=>{
    if(isPc()){
        const curWidth = document.getElementById('book-max').clientWidth -300
        const curHeight = curWidth>1500?document.getElementById('book-max').clientHeight - 100:document.getElementById('book-max').clientHeight - 200
        return {curWidth,curHeight}
    }else{
        const curWidth = document.getElementById('md-book-max').clientWidth
        const curHeight = document.getElementById('md-book-max').clientHeight - 50
        return {curWidth,curHeight}
    }
  }
const Single_Page = 'Single_Page'

function transPocket(duration,delay=0,handler){
     animationTim = setTimeout(function(){//绑定过事件还做延时处理，是transitionEnd在older Android phones不一定触发
                            animationTim = null
                            handler()
                        },(duration + delay) + 25);
}

function transend(callback){
    return ()=>{
        clearTimeout(animationTim)
        callback()
    }
}

export {
    throttle,
    onTurn,
    once,
    getEmptyPage,
    Single_Page,
    getMaxSize,
    isPc,
    transPocket,
    transend
}