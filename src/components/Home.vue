<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>{{$t("message.hello")}}</h2>
    <ul>
      <router-link to='/' tag="li">home</router-link>
      <router-link to='/about' tag="li">about</router-link>
      <router-link to='/contact' tag="li">contact</router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
