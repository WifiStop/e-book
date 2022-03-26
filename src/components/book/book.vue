<template>
  <div class="main" :style="[bookSize]">
    <div class="container" >
      <div class="test" :style="[bookSize,imgBack]">
        <img :src="newSvg" class="img-container" ref="img" @load="imgLoad"  v-if="newSvg" :style="bookSize">
        <img class="img-container" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" v-else>
      </div>
        
      <!-- <div class="box" @click="clickFn(1)"></div>
      <div class="box1" @click="clickFn(2)"></div> -->
    </div> 
    <!-- <el-dialog
      title=""
      :visible.sync="dialogVisible"
      @open="openFn"
      :custom-class="'dialog-class'"
    >
      <canvas id="myCanvas" width="1000" height="1000"></canvas>
    </el-dialog> -->
  </div>
</template>

<script>
import {mapMutations,mapGetters} from 'vuex'
import {getScale} from '@/share/utils'

let ifFirst = true;
export default {
  name: "Book",
  props:{
      svgName:{
          type:String
      },
      jpgName:{
           type:String
      },
    
  },
  data() {
    return {
      dialogVisible: false,

      type: 1,
    };
  },
  computed:{
    ...mapGetters("pcBook.store",['bookSize']),
      newSvg:function(){
          return this.svgName?require('@/assets/imgTest/'+this.svgName):null
      },
      imgBack:function(){
        return {'background-color':this.newSvg?'#ffffff':'transparent'}
      }
  },
  components: {},
  mounted() {
    
  },
  methods: {
    ...mapMutations("pcBook.store",["setScale"]),
    imgLoad(){
      getScale(this.$refs.img,this.setScale)
    },
    clickFn(type) {
      this.dialogVisible = true;
      this.type = type;
    },
    openFn() {
      if (ifFirst) {
        this.$nextTick(() => {
          this.drawImage();
        });
      } else {
        this.drawImage();
      }
    },
    drawImage() {
      const canvas = document.getElementById("myCanvas");
      const ctx = canvas.getContext("2d");
      if (this.type == 1) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.$refs.img, 100, 0, 595, 209, 0, 0, 595, 209);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.$refs.img, 420, 288, 159, 447, 0, 0, 159, 447);
      }
    },
  },
};
</script>

<style scoped lang="less">
@import "./book.less";
</style>