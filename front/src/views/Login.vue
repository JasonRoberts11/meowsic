<template>
  <div>
    <LoginPage/>
    <Footer/>
  </div>
</template>

<script>
// @ is an alias to /src
import Footer from '@/components/Footer.vue'
import LoginPage from '@/components/LoginPage.vue'
export default {
  name: 'Home',
  components: {
    Footer,
    LoginPage
  }
}
</script>
