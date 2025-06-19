<script>
import { api } from "@/api.js";


export default {
  name: "LoginView",
  data() {
    return {
      usuario: {
        login: "",
        senha: ""
      }
    };
  },
  methods: {
    async doLogin(e) {
      e.preventDefault()
      const response = await api.post('/usuario/login', this.usuario);
      const { token, error } = response.data;
      if (error)
        return alert(error.message);
      if (!token) return;
      localStorage.setItem('token', token);
      const nextRoute = new URLSearchParams(location.search).get('next') || '/';
      await this.$router.push({ path: nextRoute })
    }
  }
}
</script>

<template>
  <div class="login-view">
    <h1>Login</h1>

    <form @submit.prevent="doLogin">
      <div>
        <label for="login">Usuário:</label>
        <input id="login" type="text" v-model="usuario.login" placeholder="Digite seu usuário" required />
      </div>

      <div>
        <label for="senha">Senha:</label>
        <input id="senha" type="password" v-model="usuario.senha" placeholder="Digite sua senha" required />
      </div>

      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<style scoped>
.login-view {
  max-width: 400px;
  margin: 80px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background-color: #fff;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

form div {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 3px #4CAF50;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #45a049;
}
</style>
