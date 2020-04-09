<template>
  <div>

  <div v-if="user">
    <div v-if="!songNow ">
        <h2>Make a new Song!</h2>
      <form>
        <button type="submit" @click.prevent="addSong" class="bot">Create New Song</button>
      </form>
      <div v-if="songs.length != 0">
        <h2>Or Choose an Existing Song</h2>
        <div v-for="song in songs" v-bind:key="song.id">
        <h4>{{song.title}}
        <button @click.prevent="selectSong(song)" class="bot">Edit</button>

        <button @click.prevent="deleteSong(song._id)" class="bot">Delete</button>

        </h4>
        </div>
      </div>

    </div>
    <div v-else>
    <h3><button @click.prevent="unloadSongs" class="bot">Go Back To My Songs</button>
    </h3>
      <h2>Title:
      <input type="text" v-model="songTitle">

      </h2>
      <h3>SongBPM: <input type="number" v-model="songBPM"></h3>
      <button @click.prevent="saveSong" class="bot">Save</button>

      <SongEditor ref="editor" :parSong = "songNow"/>
    </div>
    </div>
    <div v-else>
      <h3>You need to be Logged on in order to make a song!
      </h3>
      <router-link to="/login">Go To Login</router-link>
    </div>











    <Footer/>
  </div>
</template>

<script>
// @ is an alias to /src
import Footer from '@/components/Footer.vue'
import SongEditor from '@/components/SongEditor.vue'

import axios from 'axios';

export default {
  name: 'Create',
  components: {
    Footer,
    SongEditor
  },
  data(){
  return{
    songNow: null,
    songs: [],
    songTitle: "",
    songBPM: "",
    dataNow: ""
    }
  },
  watch: {
    songBPM: function (val) {
      if(this.$refs.editor)
      this.$refs.editor.setBPM(val);
    },
    },
  computed: {
    user() {
      return this.$root.$data.user;
    }
  },
  created() {
    this.getSongs();
  },
  methods:{
    async getSongs(){
      try{
      let response = await axios.get("/api/songs");
        this.songs = response.data.songs;
    return true;
      } catch(error){
        console.log(error);
      }
    },


    async addSong() {
try {
  let response = await axios.post("/api/songs", {
    title: ("Untitled_" + this.songs.length)
  });
  console.log(response);
  this.songNow = response.data.song;
  this.importSong();
  return true;
} catch (error) {
  console.log(error);
}
},
async deleteSong(id) {
  try {
    await axios.delete('/api/songs/' + id, {

    });
    this.getSongs();

  } catch (error) {
    this.error = error.response.message;
  }
},
selectSong(inp){
  this.songNow = inp;
  this.importSong();
},
importSong(){
  this.songTitle = this.songNow.title;
  this.songBPM = this.songNow.bpm;

},
async saveSong(){
  try {
      this.songNow.title = this.songTitle;
      this.songNow.data = this.dataNow;
      this.songNow.bpm = this.songBPM;
      this.songNow.allData = this.$refs.editor.genSongArray();
        let response = await axios.put('/api/songs/' + this.songNow._id, {
          song: this.songNow
        });
        console.log(response);
        this.songNow = response.data.song;
      } catch (error) {
        this.error = error.response.message;
      }
},
unloadSongs(){
  this.songNow=null;
  this.getSongs();
}

  }




}
</script>
