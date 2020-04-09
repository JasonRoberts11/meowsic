<template>
  <div class="home">
    <h1>Welcome to Meowsic</h1>
    <div v-if="user">
    <h2>How is it going {{user.username}}?</h2>
      <router-link to="/create" class="elink">Create A Song!</router-link>




    </div>
    <div v-else>
    <div>
    <router-link to="/login" class="elink">Login</router-link>
    <router-link to="/login?signup=true" class="elink">Sign Up</router-link>
    </div>
    </div>
    <div>
      <h2>Here are the songs from Everyone!</h2>
      <div v-for="song in songs" v-bind:key="song._id">
        <h3><button @click="playSong(song)" class="bot">Play</button>

        {{song.title}} by {{ song.username}}</h3>
      </div>


    </div>




    <Footer/>
  </div>
</template>

<script>
// @ is an alias to /src
import Footer from '@/components/Footer.vue'

import axios from 'axios';
import * as Tone from "tone";
//const synth = new Tone.Synth().toMaster();
const polySynth = new Tone.PolySynth(4, Tone.Synth).toMaster();


function pitToFre(pit) {
  return 440 * Math.pow(2,(pit - 69)/12);
}

export default {
  name: 'Home',
  data(){
  return{
    beat: -1,
    songNow: null,
    songs: [],
    playInterval: null,
    }

  },
  created() {
    this.getSongs();
  },
  components: {
    Footer
  },
  computed: {
  user() {
    return this.$root.$data.user;
  },

},
beforeDestroy() {
clearInterval(this.playInterval)

},
methods:{
async getSongs(){
  try{
  let response = await axios.get("/api/songs/all");
    this.songs = response.data.songs;
return true;
  } catch(error){
    console.log(error);
  }
},
async getUser(song){
  try{
  let response = await axios.get("/api/songs/user/" +song.user);
    return response;
  } catch(error){
    console.log(error);
    return null;
  }
},
playSong(song){
  clearInterval(this.playInterval);
  this.songNow = song;
  this.songNow.rows =25;
  this.songNow.cols = 32;
  this.beat = 0;
  this.playInterval = setInterval(this.interDo,1000 / (this.songNow.bpm / 60 * 4));
},
interDo(){
  console.log(this.beat)
  this.beat = (this.beat + 1) % this.songNow.cols;
  for(let i = 0 ; i < this.songNow.rows; i++){
    if(this.songNow.allData[i * this.songNow.cols + this.beat] == 1){
    polySynth.triggerAttackRelease(pitToFre(60-i), "16n");
    }
  }
},

}
}
</script>
