<template>
  <div class="md-book-box">
      <div class="md-page-container" id="md-book-max">
        <div class="hidden-container" :style="[bookSize]">
          <div ref="moveContainer" class="move-container" @mousedown="mousedown" @mouseover="onMove($event,moveFn)" @mouseup="moveEnd($event,moveEndFn)" @touchstart="moveStart" @touchmove="onMove($event,moveFn)" @touchend="moveEnd($event,moveEndFn)">
            <div
              class="shadow"
              :style="[bookSize]"
              ref="shadow"
            ></div>
            <book
              ref="bookItem"
              class="md-page"
              :class="item.class"
              :style="item.style"
              :svgName="item.svgName"
              v-for="item of showComs"
              :key="item.key"
            >
            </book>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import {mockData} from "@/view/pc-book-container/mock";
import { getEmptyPage,transend,transPocket } from "@/share/utils";
import book from "@/components/book/book.vue";
import {mapGetters} from 'vuex'
import touchMixin from '@/mixins/touchMove'
let isMoveEnd = false
let targetPage = ''
export default {
  components:{book},
  mixins:[touchMixin],
  data(){
    return{
      pageData: mockData.data,
      maxPage: mockData.pageCount - 1,
      showComs: [],
      moveDistance:null,
       
    }
  },
  watch: {
    "$route.query.curPage": {
      immediate: true,
      handler(curValue) {
        this.curPage = curValue != undefined ? curValue : "0";
        this.bookInit();
      },
    },
  },
    computed:{
    ...mapGetters("pcBook.store",['bookSize'])
  },
  created(){
    this.$eventBus.addEventListener('startJumpMd',this.goToPage)
  },
  methods:{
    mousedown(e){
       if(this.animationPending) return
          this.animationPending = true
          this.startX = e.pageX
          this.startY = e.pageY
    },
    goToPage(page){
       const oldValue = Number(this.curPage.split('-')[0])
       const newValue = Number(page.split('-')[0]) - 1
        targetPage = page
        
        this.resetBook(this.curPage,targetPage,()=>{
          oldValue>newValue?this.continueRightMove():this.continueLeftMove()
        })
    },
    resetBook(curPage,curTargetPage,callback){
      if(curPage==curTargetPage|| this.animationPending) {
        targetPage = ''
        return
      }
       const curPageList = curPage.split('-');
      const targetPageList = curTargetPage.split('-');
      const target1 = Number(targetPageList[0]) - 1
      const isForward = Number(curPageList[0])>Number(targetPageList[0])
      const showComs = JSON.parse(JSON.stringify(this.showComs))
      const targetPage1 = this.pageData[target1] 
      console.log(Number(curPageList[0]),Number(targetPageList[0]))
       if(isForward){
          showComs[0] = this.normalizeStyle(0,targetPage1)
       }else{
         console.log("jinqule")
         showComs[2] = this.normalizeStyle(2,targetPage1)
       }
       console.log(showComs)
      this.showComs = showComs
      setTimeout(()=>{
          callback()
      },0)
    },
    bookInit() {
      this.showComs = this.factory();
      this.animationPending = false
      this.moveDistance = null
      isMoveEnd = false
      targetPage = ""
      this.$nextTick(()=>{
           const dom = this.$refs.moveContainer
          dom.style.transform = 'translate3d(-100%, 0, 0)'
      })
    },
    factory() {
      const pages = this.curPage.split("-");
      const curPage = Number(pages[0]);
      const showComs = [];
      for (let i = -1; i <= 1; i++) {
        const curIndex = curPage + i;
        const type = this.getType(i);
        const curData = this.pageData[curIndex];
        let page = null;
        if (!curData) {
          page = getEmptyPage(type);
        } else {
          page = { ...curData, type };
        }
        this.normalizeStyle(i+1, page);
        showComs.push(page);
      }
      return showComs;
    },
    moveFn(type,dValueX){
       if(isMoveEnd) return
        isMoveEnd = false
      const { book } = this.$store.state["pcBook.store"];
      const {width} = book
      const dom = this.$refs.moveContainer
      dom.style['transition-duration'] = '0ms'
     this.moveDistance = null
      if(type == 'left'){
           this.moveDistance = -width - dValueX
           
          this.move(this.moveDistance,dom)
      }else{
         this.moveDistance = -width + dValueX
        this.move(this.moveDistance,dom)
      }
    },
    move(moveDistance,e){
      const {style} = e
      style.transform = `translate3d(${moveDistance}px, 0, 0)`
    },
    moveEndFn(){
      if(!this.moveDistance) return
      isMoveEnd = true
       const { book } = this.$store.state["pcBook.store"];
      const {width} = book
      
      if(this.moveDistance < (-width)){
        const lastDifference = -width - this.moveDistance
        if(lastDifference<width/3){
          this.stopMove()
        }else{
          this.continueLeftMove()
        }
      }else if(this.moveDistance > (-width)){
        const lastDifference = this.moveDistance - (-width)
        if(lastDifference<width/3){
          this.stopMove()
        }else{
          this.continueRightMove()
        }
      }
    },
    stopMove(){
      const dom = this.$refs.moveContainer
      const {style} = dom
      style['transition-duration'] = '0.3s'
      style.transform = `translate3d(-100%, 0, 0)`
      const handler = () => {
       this.animationPending = false
        isMoveEnd = false
      };
      const listener = transend(handler);
      dom.addEventListener("transitionend", listener);
       transPocket(300,0,handler)
    },
    continueLeftMove(){
        const target = Number(this.curPage) + 1
      if(target > this.maxPage){
        this.stopMove()
        return
      }
      const dom = this.$refs.moveContainer
      const {style} = dom
      style['transition-duration'] = '0.3s'
      style.transform = `translate3d(-200%, 0, 0)`
      this.animationEnd(dom,()=>{
        const lastTarget = targetPage?Number(targetPage)-1:target
        this.$router.replace({query:{curPage:lastTarget}})
      })
      
    },
    animationEnd(dom,callback){
      
      const handler = () => {
        const {style} = dom
        style['transition-duration'] = '0ms'
        callback();
        dom.removeEventListener("transitionend", listener);
      };
      const listener = transend(handler);
      dom.addEventListener("transitionend", listener);
       transPocket(300,0,handler)
    },
    continueRightMove(){
      const target = Number(this.curPage) - 1
      if(target < 0){
        this.stopMove()
        return
      }
      const dom = this.$refs.moveContainer
      const {style} = dom
      style['transition-duration'] = '0.3s'
      style.transform = `translate3d(0, 0, 0)`
        this.animationEnd(dom,()=>{
        const lastTarget = targetPage?Number(targetPage)-1:target
        this.$router.replace({query:{curPage:lastTarget}})
      })
    },
     getType(index) {
      if (index === -1) {
        return "previous";
      } else if (index === 0) {
        return "current";
      } else {
        return "next";
      }
    },
    normalizeStyle(i, page){
      const styleArr = [
        {left:0},
        {left:'100%'},
        {left:'200%'}
      ]
      page.style = styleArr[i];
      return page
    }
  }
}
</script>

<style lang="less" scoped>
@import "./mdBookContainer.less";
</style>