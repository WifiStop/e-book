import { throttle } from "@/share/utils";
const touchMixin = {
    data(){
        return {
            startX: 0, // 触摸起始x
            startY: 0, // 触摸起始y
            endX: 0, // 触摸结束x
            endY: 0, // 触摸结束y
            canMove: true, // 是否可以继续滑动
            index: 0, // 控制滑动下标,
            animationPending:false
        }
    },
    methods:{
        moveStart(e) {
          if(this.animationPending) return
          this.animationPending = true
          this.startX = e.targetTouches[0].pageX
          this.startY = e.targetTouches[0].pageY
        },
        onMove:throttle(function(e,callback){ 
        
          this.endX =  e.pageX || e.targetTouches[0].pageX
          this.endY = e.pageY || e.targetTouches[0].pageY
          const dValueX = Math.abs(this.startX - this.endX)
          const dValueY = Math.abs(this.startY - this.endY)
          if (dValueX > dValueY) {
            e.preventDefault()
            if ( this.startX > this.endX) {
              // 向左划
                this.canMove = false
                callback&&callback('left',dValueX)
            } else{
              this.canMove = false
              callback&&callback('right',dValueX)
            }
          } else {
              // 恢复默认事件
              e.returnValue = true;
          }
        },10),
        moveEnd(e,callback) {
          this.canMove = true
          this.startX = this.endX = 0
          this.startY = this.endY = 0
          callback&&callback()
        },    
    }
}
export default touchMixin