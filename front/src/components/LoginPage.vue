<template>
<div>
  <h1>Login Please</h1>
  <div v-if="signup">
    <form>
      <fieldset>
        <legend>Signup</legend>
        Nickname: <input placeholder="nickname" v-model="nickname">  <br/>
        Username: <input placeholder="username" v-model="username"> <br/>
        Password: <input type="password" placeholder="password" v-model="password"> <br/>
        <button type="submit" @click.prevent="register" class="bot">Register</button>
        </fieldset>
      </form>
      <p v-if="error" class="error">{{error}}</p>
      <a @click.prevent="mlogin" class="bot">Already have a Login?</a>
    </div>
    <div v-else>
      <form>
      <fieldset>
        <legend>Login</legend>
        Username: <input placeholder="username" v-model="usernameLogin"> <br/>
        Password: <input type="password" placeholder="password" v-model="passwordLogin"> <br/>
        <button type="submit" @click.prevent="login" class="bot">Login</button>
        </fieldset>
      </form>
      <p v-if="errorLogin" class="error">{{errorLogin}}</p>
      <a @click.prevent="msignup" class="bot">Don't have a Login?</a>
    </div>
</div>
</template>

<style scoped>
fieldset{
  margin:30px;
  padding:10px;
}
</style>


<script>
import axios from 'axios'

export default{
name: 'LoginPage',
data() {
  return {
    signup: false,

    nickname: '',
    username: '',
    password: '',
    usernameLogin: '',
    passwordLogin: '',
    error: '',
    errorLogin: '',
  }
},
created (){
if(this.$route.query.signup)
  this.signup = this.$route.query.signup;
},
methods: {
async register() {
  this.error = '';
  this.errorLogin = '';
  if (!this.nickname || !this.username || !this.password)
    return;
  try {
    let response = await axios.post('/api/users', {
      nickname: this.nickname,
      username: this.username,
      password: this.password,
    });
    this.$root.$data.user = response.data.user;
    this.$router.push('/');
  } catch (error) {
    this.error = error.response.data.message;
    this.$root.$data.user = null;
  }
},
async login() {
   this.error = '';
   this.errorLogin = '';
   if (!this.usernameLogin || !this.passwordLogin)
     return;
   try {
     let response = await axios.post('/api/users/login', {
       username: this.usernameLogin,
       password: this.passwordLogin,
     });
     this.$root.$data.user = response.data.user;
     this.$router.push('/');

   } catch (error) {
     this.errorLogin = "Error: " + error.response.data.message;
     this.$root.$data.user = null;
   }
 },
 mlogin(){
  this.signup = false;
},
msignup(){
 this.signup = true;
}
}
}

</script>
