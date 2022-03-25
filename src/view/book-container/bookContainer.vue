<template>
  <div class="container" :style="container">
    <div class="button-test">
      <button @click="test">测试</button>
    </div>
    <div
      class="shadow"
      :style="bookShadow(curPage, maxPage)"
      ref="shadow"
      v-show="!coverToBack"
    ></div>
    
    <div
      class="book-container"
      :style="[container, specialStyle(curPage, maxPage)]"
      ref="bookContainer"
    >
      <div
        v-show="curPage !== '0' "
        class="point point-left-top"
        @mousedown.stop.prevent="move('right')"
      >
        <span></span>
      </div>
      <div
        v-show="curPage !== '0' "
        class="point point-left-bottom"
        @mousedown.stop.prevent="move('right')"
      >
        <span></span>
      </div>
      <div
        v-show="curPage !== maxPage + ''"
        class="point point-right-top"
        @mousedown.stop.prevent="move('left')"
      >
        <span></span>
      </div>
      <div
       v-show="curPage !== maxPage + ''"
        class="point point-right-bottom"
        @mousedown.stop.prevent="move('left')"
      >
        <span></span>
      </div>
      <div class="back" v-show="curPage !== '0' && isShowOptionButton">
        <button @click="previousPage(false)">上一页</button>
        <button @click="homePage">第一页</button>
      </div>
      <div
        class="forward"
        v-show="curPage !== maxPage + '' && isShowOptionButton"
      >
        <button @click="nextPage(false)">下一页</button>
        <button @click="lastPage">最后一页</button>
      </div>
      
      <book
        ref="bookItem"
        class="book-item"
        :class="item.class"
        :style="item.style"
        :svgName="item.svgName"
        v-for="item of showComs"
        :key="item.key"
      >
      </book>
      
    </div>
  </div>
</template>

<script>
import book from "@/components/book/book.vue";
import { mockData } from "./mock";
import { mapMutations, mapGetters } from "vuex";
import { getEmptyPage, throttle } from "@/share/utils";

let animationPending = false;
let moveEnd = false
let isMove = false
 let targetPage = ''
export default {
  name: "App",
  components: { book },
  data() {
    return {
      pageData: mockData.data,
      maxPage: mockData.pageCount - 1,
      curPage: "0",
      showComs: [],
      isShowOptionButton: true,
      coverToBack:false
    };
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
  mounted() {
    this.$nextTick(() => {
      this.setBookContainer();
    });
  },
  created() {

     
  },
  methods: {
    ...mapMutations("pcBook.store", ["setBookContainer"]),
    test(){
      this.resetBook(this.curPage,targetPage = '3-4',()=>{
         this.nextPage()
      })
    },
    homePage(){
       this.resetBook(this.curPage,targetPage = '0',()=>{
         this.previousPage()
      })
      
    },
    lastPage(){
      this.resetBook(this.curPage,targetPage = this.maxPage+'',()=>{
        this.nextPage(false)
      })
    },
    move(type) {
       if (animationPending) return;
      animationPending = true;
      const client = this.$refs.bookContainer.getBoundingClientRect();
      let angle = 0;
      let {page1,page2} = this.getPage(type)
      page1.style.transition = page2.style.transition = `transform 0s ease 0s`;
      let pageFn = type=='left'?'nextPage':'previousPage'
      const mousemove = throttle((event) => {
        if(moveEnd) return
        moveEnd = false
        isMove = true
        this.isShowOptionButton = false;
        const clientX = event.clientX;
        const moveDistance = this.getMoveDistance(type, clientX, client);
        if (moveDistance > 0) {
          angle = this.getAngle(moveDistance);
          this.startMove(type,angle,page1,page2)
        }
      }, 20);
      const mouseup = (event) => {
        this.isShowOptionButton = true;
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
        moveEnd = true
        if(!isMove){
          this[pageFn](true)
          return
        }
        this.isContinue(page1, page2, angle,type);        
        return false;
      };
      document.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    },
    startMove(type,angle,page1,page2){
      if(type == 'left'){
        page1.style.transform = `rotateY(${-angle}deg)`;
          page1.style["z-index"] = 9;
          page2.style.transform = `rotateY(${180 - angle}deg)`;
      }else{
        page1.style.transform = `rotateY(${-180 + angle}deg)`;
          page1.style["z-index"] = 9;
          page2.style.transform = `rotateY(${angle}deg)`;
      }
    },
    getPage(type) {
      const bookItems = document.getElementsByClassName("book-item");
      const len = bookItems.length;
      if (type == "left") {
        return { page1: bookItems[len - 3], page2: bookItems[len - 2] };
      } else {
        return { page1: bookItems[1], page2: bookItems[2] };
      }
    },
    getAngle(moveDistance) {
      const { book } = this.$store.state["pcBook.store"];
      const width = book.width - moveDistance;
      const cos = width / book.width;
      return (Math.acos(cos) * 180) / Math.PI;
    },
    getMoveDistance(type, clientX, client) {
      if (type == "left") {
        return client.right - clientX;
      } else {
        return clientX - client.left;
      }
    },

    isContinue(page1, page2, angle,type) {
      page1.style.transition =
        page2.style.transition = `transform 0.3s ease 0s`;
      if (angle > 90) {
        if(type == 'left'){
            this.nextPage(true)
        }else{
          this.previousPage(true)
        }
      } else {
        if(type == 'left'){
          page1.style.transform = `rotateY(0)`;
        page1.style["z-index"] = 4;
        page2.style.transform = `rotateY(180deg)`;
        }else{
          page1.style.transform = `rotateY(-180deg)`;
        page1.style["z-index"] = 4;
        page2.style.transform = `rotateY(0deg)`;
        }
        
       const listener = () => {
         page1.removeEventListener("transitionend", listener);
        isMove = false
        animationPending = false
        moveEnd = false
        
        };
        page1.addEventListener("transitionend", listener);
      }
    },
    nextPage(next) {
      if (animationPending&&!next)return
      animationPending = true;
      if (this.curPage === "0") {
        this.openCover();
      } else {
        const pages = this.curPage.split("-");
        const isBottoming = Number(pages[0]) + 2 == this.maxPage || targetPage==this.maxPage;
        if (isBottoming) {
          this.closeCoverBack();
        } else {
          this.nextPageAnimation();
        }
      }
    },
    previousPage(next) {
      if (animationPending&&!next) return;
      animationPending = true;
      const pages = this.curPage.split("-");
      const isBottoming = Number(pages[0]) == this.maxPage;
      if (isBottoming) {
        this.openCoverBack();
      } else {
        const isToping = Number(pages[0]) - 1 == 0 || targetPage==='0';
        if (isToping) {
          this.closeCover();
        } else {
          this.previousPageAnimation();
        }
      }
    },
    bookInit() {
      
      this.showComs = this.factory();
      animationPending = false;
      isMove = false
      moveEnd = false 
      targetPage=''
       setTimeout(()=>{
        this.coverToBack = false
      },500)
    },
    factory() {
      const pages = this.curPage.split("-");
      const curPage = Number(pages[0]);
      const showComs = [];
      const startIndex = curPage == 0 ? -3 : -2;
      const endIndex = curPage == 0 ? 2 : 3;
      for (let i = startIndex; i <= endIndex; i++) {
        const curIndex = curPage + i;
        const type = this.getType(i);
        const curData = this.pageData[curIndex];
        let page = null;
        if (!curData) {
          page = getEmptyPage(type);
        } else {
          page = { ...curData, type };
        }
        this.normalizeClass(i, startIndex, page);
        this.normalizeStyle(i, startIndex, page);
        showComs.push(page);
      }
      return showComs;
    },
    resetBook(curPage,targetPage,callback){
      if(curPage==targetPage|| animationPending) return
      const curPageList = curPage.split('-');
      const targetPageList = targetPage.split('-');
      const target1 = Number(targetPageList[0])
      const target2 = Number(targetPageList[1])
      const isForward = Number(curPageList[0])>Number(targetPageList[0])
      const showComs = JSON.parse(JSON.stringify(this.showComs))
      const targetPage1 = this.pageData[target1] 
        const targetPage2 = this.pageData[target2]
      if(isForward){
       this.resetPreviousPage(target1,showComs,targetPage1,targetPage2)
      }else{
       this.resetNext(target1,showComs,targetPage1,targetPage2)
      }
      this.showComs = showComs
      setTimeout(()=>{
          callback()
      },0)
     
      console.log(this.showComs,showComs)
    },
    resetPreviousPage(target1,showComs,targetPage1,targetPage2){
      if(target1 !== 0){
          showComs[0] = this.normalizePage(0,targetPage1)
          showComs[1] = this.normalizePage(1,targetPage2) 
        }else{
          showComs[0] = this.normalizePage(0,getEmptyPage('previous')) 
          showComs[1] = this.normalizePage(1,targetPage1)    
        }
    },
    resetNext(target1,showComs,targetPage1,targetPage2){
       if(target1==this.maxPage){
          showComs[4] = this.normalizePage(4,targetPage1)
          showComs[5] = this.normalizePage(5,getEmptyPage('next')) 
        }else{
          showComs[4] = this.normalizePage(4,targetPage1)
          showComs[5] = this.normalizePage(5,targetPage2) 
        }
    },
    normalizePage(curIndex,page){
      return this.normalizeStyle(null,null,this.normalizeClass(null,null,page,curIndex),curIndex) 
    },
    normalizeClass(index, startIndex, page,curIndex) {
      const difference = curIndex || (index - startIndex);
      const classArr = [
        ["book-left"],
        ["book-right"],
        ["book-left"],
        ["book-right"],
        ["book-left"],
        ["book-right"],
      ];
      page.class = classArr[difference];
      return page;
    },
    normalizeStyle(index, startIndex, page,curIndex) {
      const difference = curIndex || (index - startIndex);
      const styleArr = [
        { "z-index": 1 },
        { "z-index": 3, transform: "rotateY(-180deg)" },
        { "z-index": 6, transform: "rotateY(0deg)" },
        { "z-index": 4, transform: "rotateY(0deg)" },
        { "z-index": 7, transform: "rotateY(180deg)" },
        { "z-index": 2 },
      ];
      page.style = styleArr[difference];
      return page;
    },
    getType(index) {
      if (index === -2 || index === -1) {
        return "previous";
      } else if (index === 0 || index === 1) {
        return "current";
      } else {
        return "next";
      }
    },
    openCover() {
      const { book } = this.$store.state["pcBook.store"];
      this.isShowOptionButton = false;
      this.$refs.bookContainer.style.left = "0px";
      this.$refs.bookContainer.style.transition = "all 0.3s linear";
      this.$refs.shadow.style.transition = "all 0.3s linear";
      if(this.curPage=='0'&&targetPage==this.maxPage){
        this.coverToBack = true
      }else{
        this.$refs.shadow.style.left = book.width + "px";
      }
      this.rightTurn(() => {
        this.isShowOptionButton = true;
        this.$refs.shadow.style.transition = "";
        const startIndex = Number(this.curPage) + 1,
          endIndex = Number(this.curPage) + 2;
          const target = targetPage?targetPage:`${startIndex}-${endIndex}`
        this.$router.replace({
          query: {
            curPage: target,
          },
        });
        
      });
    },
    openCoverBack() {
      this.$refs.bookContainer.style.left = "0px";
      this.$refs.bookContainer.style.transition = "all 0.3s linear";
      this.$refs.shadow.style.transition = "all 0.3s linear";
      this.isShowOptionButton = false;
      if(this.curPage==this.maxPage&&targetPage=='0'){
        this.coverToBack = true
      }else{
        this.$refs.shadow.style.left = "0px";
      }
      this.leftTurn(() => {
        this.isShowOptionButton = true;
        this.$refs.shadow.style.transition = "";
        const startIndex = this.maxPage - 2,
          endIndex = this.maxPage - 1;
          const target = targetPage?targetPage:`${startIndex}-${endIndex}`
        this.$router.replace({
          query: { curPage: target },
        });
      });
    },
    
    closeCoverBack() {
      const { book } = this.$store.state["pcBook.store"];
      this.$refs.shadow.style.width = book.width + "px";
      this.isShowOptionButton = false;
      this.rightTurn(() => {
        this.isShowOptionButton = true;
        this.$refs.bookContainer.style.left = book.width / 2 + "px";
        this.$refs.bookContainer.style.transition = "all 0.3s linear";
        this.$refs.shadow.style.left = book.width / 2 + "px";
        this.$refs.shadow.style.transition = "all 0.3s linear";
        this.$router.replace({query:{curPage:this.maxPage}})
      });
    },
    closeCover() {
      const { book } = this.$store.state["pcBook.store"];
      this.$refs.shadow.style.width = book.width + "px";
      this.$refs.shadow.style.left = book.width + "px";
      this.isShowOptionButton = false;
      this.leftTurn(() => {
        this.isShowOptionButton = true;
        this.$refs.bookContainer.style.left = -(book.width / 2) + "px";
        this.$refs.bookContainer.style.transition = "all 0.3s linear";
        this.$refs.shadow.style.left = book.width / 2 + "px";
        this.$refs.shadow.style.transition = "all 0.3s linear";
        this.$router.replace({query:{}})
      });
    },
    leftTurn(callback) {
      const bookItems = document.getElementsByClassName("book-item");
      const page1 = bookItems[1];
      const page2 = bookItems[2];
      page1.style.transform = `rotateY(0)`;
      page1.style.transition = `transform 1s ease 0s`;
      page1.style["transform-origin"] = `0 0`;
      page1.style["z-index"] = 9;
      page2.style.transform = `rotateY(180deg)`;
      page2.style.transition = `transform 1s ease 0s`;
      page2.style["transform-origin"] = `100% 0`;
      const listener = () => {
        page1.style.transition = `transform 0.3s ease 0s`;
        page2.style.transition = `transform 0.3s ease 0s`;
        callback();
        page1.removeEventListener("transitionend", listener);
      };
      page1.addEventListener("transitionend", listener);
    },
    rightTurn(callback) {
      const bookItems = document.getElementsByClassName("book-item");
      const len = bookItems.length;
      const page1 = bookItems[len - 3];
      const page2 = bookItems[len - 2];
      page1.style.transform = `rotateY(-180deg)`;
      page1.style.transition = `transform 1s ease 0s`;
      page1.style["transform-origin"] = `0 0`;
      page2.style.transform = `rotateY(0)`;
      page2.style.transition = `transform 1s ease 0s`;
      page2.style["transform-origin"] = `100% 0`;
      const listener = () => {
        // page1.style.transition = `transform 0.3s ease 0s`;
        // page2.style.transition = `transform 0.3s ease 0s`;
        callback();
        page1.removeEventListener("transitionend", listener);
      };
      page1.addEventListener("transitionend", listener);
    },
    nextPageAnimation() {
      this.rightTurn(() => {
        const pages = this.curPage.split("-");
        const nextPage = Number(pages[1]) + 1,
        nextTwoPage = Number(pages[1]) + 2;
        const target = targetPage?targetPage:`${nextPage}-${nextTwoPage}`
        this.$router.replace({
          query: { curPage: target },
        });
      });
    },
    previousPageAnimation() {
      this.leftTurn(() => {
        const pages = this.curPage.split("-");
        const previousPage = Number(pages[0]) - 1,
          previousTwoPage = Number(pages[0]) - 2;
          const target = targetPage?targetPage:`${previousTwoPage}-${previousPage}`
        this.$router.replace({
          query: { curPage: target },
        });
      });
    },
  },
  computed: {
    ...mapGetters("pcBook.store", [
      "bookShadow",
      "container",
      "bookSize",
      "specialStyle",
    ]),
  },
};
</script>

<style lang="less" scope>
@import "./bookContainer.less";
</style>
