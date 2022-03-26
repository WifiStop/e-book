<template>
  <div class="all-container">
      <div class="pc-container" >
        <div class="book-max" id="book-max">
              <PcBookContainer></PcBookContainer>
        </div>
        <img :src="logo" class="logo">
        <div class="right-title">
        <div class="your-title">Your Title</div>
        <div class="date">2022/01</div>
        </div>
        <div class="right-desc">
        <img :src="message" alt="" class="img-message">
        <div class="describe">
            Please fill in the corresponding content here.
        </div>
        </div>
        <div class="left-option">
            <img :src="allPage" class="all-page jump-button" @click="showAllPage">
            <span>jump to</span>
            <input v-model="page" type="number" min="0">
            <img :src="jump" alt="" @click="jumpPage" class="jump-button">
        </div>
        
     </div>
        <div class="md-container" >
            <div class="md-top">
                <img :src="logo" class="logo">
            </div>
             <MdBookContainer/>

            <div class="md-bootom">
                 <img :src="allPage" class="all-page jump-button" @click="showAllPage">
            </div>
      </div>
      <AllPageDrawer ref="AllPageDrawer"></AllPageDrawer>
  </div>
</template>

<script>
import PcBookContainer from '@/view/pc-book-container/pcBookContainer.vue'
import MdBookContainer from '@/view/md-book-container/mdBookContainer.vue'
import logo from '@/assets/icon/logo.svg'
import message from '@/assets/icon/message.png'
import allPage from '@/assets/icon/allPage.svg'
import jump from '@/assets/icon/jump.png'
import {Single_Page} from '@/share/utils'
import AllPageDrawer from '@/components/allPageDrawer/allPageDrawer.vue'
export default {
    components:{MdBookContainer,PcBookContainer,AllPageDrawer},
    data(){
        return {
            logo:logo,
            message:message,
            allPage:allPage,
            jump:jump,
            page:'',
        }
    },
    methods:{
        jumpPage(){
            this.$eventBus.dispatchEvent('startJump',this.page,Single_Page)
        },
        showAllPage(){
        this.$refs.AllPageDrawer.showDom()
        },
    }
}
</script>

<style lang="less" scoped>
    @import "./bookContainer.less";
</style>