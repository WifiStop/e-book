<template>
  <div class="all-page-drawer" v-show="isShow">
    <div class="mask" @click="hiddenDom"></div>
    <div class="all-page-container"  >
        <div class="all-page-title">Viva vena</div>
        <div class="thumbnail-container" v-if="isRender">
          <div class="thumbnail" data-page="1" @click="jump('1')">
            <img :src="jpgSrc(imgData[0].svgName)" alt="">
            <div>1</div>
          </div>
          <div class="thumbnail" @click="jump(index+2+'')" v-for="(item,index) in imgMiddleData" :key="index" v-if="index%2==0" :data-page="index+2">
            <div class="thumbnail-column">
              <img :src="jpgSrc(imgMiddleData[index].svgName)" alt="">
              <img :src="jpgSrc(imgMiddleData[index+1].svgName)" alt="">
            </div>
              
              <div>{{index+2}}</div>
          </div>
           <div class="thumbnail" :data-page="maxPage" @click="jump(maxPage+'')">
            <img :src="jpgSrc(imgData[maxPage].svgName)" alt="">
            <div>{{maxPage+1}}</div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import {mockJpgData} from '@/view/pc-book-container/mock'
import {Single_Page,isPc} from '@/share/utils'

let node = null
let isFirst = true
export default {
  data(){
    return {
      imgData:mockJpgData.data,
      maxPage:mockJpgData.pageCount - 1,
      isShow:false,
      isRender:false
    }
  },
  computed:{
    jpgSrc(){
      return function(svgName){
        return svgName?require('@/assets/imgTest/'+svgName):null
      }
    },
    imgMiddleData(){
      const data = JSON.parse(JSON.stringify(mockJpgData.data))
      data.pop()
      data.shift()
      return data
    },
   
  },
  mounted(){
     node = this.$mount().$el
    document.body.appendChild(node)
  },
  methods:{
    startRender(){
      setTimeout(()=>{
        if(isFirst){
          isFirst = false
          this.isRender = true
        }
      },1225)
    },
     jump(page){
       if(isPc()){
          this.$eventBus.dispatchEvent('startJump',page,Single_Page)
       }else{
          this.$eventBus.dispatchEvent('startJumpMd',page)
       }
     
      this.hiddenDom()
    },
    hiddenDom(){
      this.isShow = false
    },
    showDom(){
      this.isShow = true
      this.startRender()
    }
  },
  destroyed(){
     document.body.removeChild(node)
  }
}
</script>

<style lang="less" scoped>
    @import './allPageDrawer.less';
</style>