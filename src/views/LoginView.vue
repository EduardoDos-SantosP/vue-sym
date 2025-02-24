<script>
export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      // Simulate login logic
      if (this.username === "admin" && this.password === "password") {
        this.$router.push("/dashboard");
      } else {
        alert("Invalid credentials");
      }
    }
  }
}
</script>

<template>
  <form>
    <input type="text" v-model="username" placeholder="Username" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="login">Login</button>
  </form>
</template>

<style scoped>

</style>