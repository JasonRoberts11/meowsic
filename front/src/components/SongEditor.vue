<template>
  <div class="hello">
    <h2 class="elink">
      Song EDITOR:
    </h2>
    <!---<canvas id="c" @mousemove="movemouse" @mousedown="downmouse" @mouseup="upmouse">
    </canvas>--->
    <table>
      <tr v-for="row of songData" :key="row.id">
        <td v-for="col of row.val" :key="col.id">
          <button @click="edit(col)" class="but"
          v-bind:class="[ { low: (col.id % 8 == 0)||([1,3,5,7,8,10].includes(row.id %12)) },{med: row.id %12 == 0},{ hig: (col.id == beat) },{ re: (col.val==1) }]"></button>
        </td>
      </tr>
    </table>
    <button  @click="play()" v-if="!isplay">Play</button>
    <button  @click="play()" v-else>Stop</button>



  </div>
</template>

<style scoped>

table{
  margin:auto;
  border:1px solid black;
  background: #001122;
  padding:4px 3px 3px 3px;
}
.but{
  width:100%;
  height:100%;
  padding:0px 0px 0px 0px;
  margin:0px 0px 0px 0px;
  border:none;
  background: #002244;
  border-radius:2px;
  outline: none;
}
.but:hover{
  background: #006688;
  border-radius:2px;
}
.low{
  background: #003355;
}
.med{
  background: #005577;
}
.hig{
  background: #006688;
}
.re{
  background: #2299ee;
}
td{
  width:25px;
  height:25px;
  margin:0px 0px 0px 0px;
  padding:0px 0px 0px 0px;
}


</style>





<script>
import * as Tone from "tone";
//const synth = new Tone.Synth().toMaster();
const polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();


function pitToFre(pit) {
  return 440 * Math.pow(2,(pit - 69)/12);
}




export default{
  name: "SongEditor",
  props:[
    'parSong'
  ],
  data(){
    return{
      rows: 25,
      cols: 32,
      isplay:false,
      songData: [],
      rawData: [],
      stringData: "",
      playInterval: null,
      beat: -1,
      bpm: 60,
      }
  },
  created(){
    this.createEmptyArray();
    if(this.parSong){
      this.bpm = this.parSong.bpm;
      this.getSongArray(this.parSong.allData);
    }

    //this.playInterval = setInterval(this.interDo,1000 / (this.bpm / 60 * 4));

  },
  beforeDestroy() {
  clearInterval(this.playInterval)

  },
  methods:{
  setBPM(bpm){
  this.bpm = bpm;
  //console.log("Setbpm:" + bpm);
  clearInterval(this.playInterval);
  this.isplay = false;
  },


    interDo(){
      this.beat = (this.beat + 1) % this.cols;
      for(let i = 0 ; i < this.rows; i++){
        if(this.rawData[i * this.cols + this.beat] == 1){
        polySynth.triggerAttackRelease(pitToFre(60-i), "16n");
        }
      }
    },
    createEmptyArray(){
      let a = [];
      let aa = [];
      for(let i=0; i<this.rows; i++){
        let b = [];
        for(let j=0; j<this.cols; j++){
          let c = {id:j,hig:i,val:0};
          b.push(c);
          aa.push(0);
        }
        a.push({id:i,val:b})
      }
      this.songData = a;
      this.rawData = aa;
    },
    edit(item){
    let d = this.songData[item.hig].val[item.id];
      if(d.val == 0){
        d.val = 1;
        this.rawData[item.hig*this.cols+item.id] = 1;
      }else{
        d.val = 0;
        this.rawData[item.hig*this.cols+item.id] = 0;
      }
    },
    play(){
      if(this.isplay){
      clearInterval(this.playInterval)
      this.isplay = false;
      }else{
      this.beat =-1;
      this.isplay = true;
      this.playInterval = setInterval(
        this.interDo
      ,1000 / (this.bpm / 60 * 4));
      }

    },
    genSongArray(){
      return this.rawData;
    },
    getSongArray(data){
      if(data.length <10){
      return;
      }
      for(let i = 0; i < data.length; i ++){
        if(data[i]){
        this.rawData[i] = data[i];
        this.songData[Math.floor(i/this.cols)].val[i% this.cols].val = data[i];
        }
      }

    }

  }


}

















/*
function gridpanel(x,y,wid,hig,divx,divy){
    this.x = x;
    this.y = y;
    this.wid = wid;
    this.hig = hig;
    this.divx = divx;
    this.divy = divy;
    this.bx = this.wid/this.divx;
    this.by = this.hig/this.divy;
    this.scrollx = 0;
    this.scrolly = 0;
    this.renderGrid = (ctx) => {
      ctx.fillRect(x,y,this.wid,this.hig);
      for(let i = 0; i < this.divy; i++){
        for(let j = 0; j < this.divx; j++){
          ctx.strokeRect(this.x + j*this.bx,this.y+i*this.by,this.bx,this.by);
        }
      }
    }
    this.mouse = (ms,ctx) =>{
      let i = Math.floor(ms.y/this.by);
      let j = Math.floor(ms.x/this.bx);
      ctx.fillRect(this.x + j*this.bx,this.y+i*this.by,this.bx,this.by);
      return {x: j, y: i}
    }
    this.drawSquare = (i,j,ctx) =>{
      ctx.fillRect(this.x + j*this.bx,this.y+i*this.by,this.bx,this.by);
      return {x: j, y: i}
    }
}

export default {
  name: 'SongEditor',
  data(){
    return{
    songData: [],
    ctx: null,
    cwid:600,
    chig:600,
    dhig:200,
    dscroll: {x:0,y:0},
    mainpanel: new gridpanel(0,0,600,600,16,37),
    mouse: {x:0,y:0},
    bg: {line: "#004488", fill: "#000000"},
    color: {line: "#004488", fill: "#ababbb"}

    }
  },

  mounted() {
      var c = document.getElementById("c");
      var ctx = c.getContext("2d");
      this.ctx = ctx;
      c.width = this.cwid;
      c.height =  this.chig + this.dhig;
      this.render();
  },
  methods:{
      render() {
      // clear canvas

      this.ctx.clearRect(0, 0, this.cwid, this.chig + this.dhig);

      this.ctx.strokeStyle = this.bg.line;
      this.ctx.fillStyle = this.bg.fill;
      this.mainpanel.renderGrid(this.ctx);
      this.ctx.fillStyle = this.color.fill;
      let draw = this.mainpanel.mouse(this.mouse,this.ctx);


      //this.renderBackBoard(this.divisionsX,this.divisionsY,this.ctx);
      //this.renderPlayBoard(this.divX,this.divY,this.ctx);
      // draw rect
      this.ctx.strokeRect(0, 0, this.cwid,  this.chig + this.dhig);
      this.ctx.strokeRect( this.mouse.x, 0, 0, this.chig+this.dhig);
      this.ctx.strokeRect( 0, this.mouse.y, this.cwid, 0);
      this.ctx.strokeRect(0,0, this.mouse.x, this.mouse.y);

    },
    movemouse(evt){
      this.mouse.x = (evt.offsetX);
      this.mouse.y = (evt.offsetY);
      this.render();
    },
    downmouse(){
      this.mouse.down = true;
    },
    upmouse(){
      this.mouse.down = false;
    },
    renderBackBoard(dx,dy,ctx){
    ctx.fillStyle = this.bg.fill;
    ctx.fillRect(0,0,this.cwid,this.chig);
    ctx.strokeStyle = this.bg.line;
    let bw = this.cwid/dx;
    let bh = this.chig/dy;
      for(let i = 0; i < dy; i++){
        for(let j = 0; j < dx; j++){
          ctx.strokeRect(j*bw,i*bh,bw,bh);
        }
      }
    },
    renderPlayBoard(dx,dy,ctx){
    let bw = this.cwid/dx;
    let bh = this.dhig/dy;
    ctx.fillStyle = this.bg.fill;

    ctx.fillRect(0,this.chig,this.cwid,this.dhig);

      for(let i = 0; i < dy; i++){
        for(let j = 0; j < dx; j++){
          ctx.strokeRect(j*bw,i*bh +this.chig,bw,bh);
        }
      }
    },
    renderCat(x,y,sx,sy,ctx){
    ctx.fillRect(x,y,sx,sy);

    }

  }

}
*/









</script>
