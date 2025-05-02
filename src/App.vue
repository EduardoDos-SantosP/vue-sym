<script setup>
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <!-- Menu Lateral -->
    <aside class="sidebar">
      <h2>Menu</h2>
      <nav>
        <ul>
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/movimentacao">Movimentação</RouterLink></li>
          <li><RouterLink to="/movimentacao-item">Movimentação Item</RouterLink></li>
        </ul>
      </nav>
    </aside>

    <!-- Conteúdo Principal -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 220px;
  background-color: #2c3e50;
  color: #fff;
  padding: 20px;
}

.sidebar h2 {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  margin: 10px 0;
}

.sidebar a {
  color: #ecf0f1;
  text-decoration: none;
}

.sidebar a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}

.main-content {
  flex: 1;
  padding: 30px;
  background-color: #f4f4f4;
}
</style>
