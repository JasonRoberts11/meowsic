<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Meowsic</router-link>
      <router-link to="/create">Create</router-link>

      <router-link to="/about">About</router-link>
      <a v-if="this.$root.$data.user">
        {{this.$root.$data.user.username}}
        <button @click.prevent="signOut" class="bot">Log Out</button>
      </a>
      <a v-else>
        <router-link to="/login">Login</router-link>
      </a>
    </div>
    <router-view/>
  </div>
</template>

<script>
import axios from 'axios';

export default{
name: 'app',
async created() {
try {
  let response = await axios.get('/api/users');
  this.$root.$data.user = response.data.user;
} catch (error) {
  this.$root.$data.user = null;
}
},
computed: {
  user() {
    return this.$root.$data.user;
  }
},
methods: {
async signOut() {
  try {
    await axios.delete("/api/users");
    this.$root.$data.user = null;
  } catch (error) {
    this.$root.$data.user = null;
  }
},
}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body{
margin: 0px;
}

#nav {
  padding: 10px;
  background-color: #abcdef;
}

#nav a {
  font-weight: bold;
  color: #0088bb;
  text-decoration: none;
  margin:10px;
}
.bot{
  border:none;
  font-weight:bold;
  background: #204080;
  color: #ffffff;
  border-radius:10px;
  padding:2px 10px;
  margin:5px;
}
.bot:hover{
  background: #406090;
}
.elink{
color: #003388;
font-weight:bold;
font-size:3em;
margin:10px;
}

#nav a.router-link-exact-active {
  color: #003355;
}
</style>
