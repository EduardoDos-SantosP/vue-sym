<script>
import {api} from "@/api.js";

export default {
  name: "MovimentacaoView",
  data() {
    return {
      movimentacoes: [],
      selectedMovimentacao: null,
      formMovimentacao: {
        id: null,
        nome: null,
        data: null,
        descricao: null,
        valor: null,
      }
    };
  },
  methods: {
    salvarMovimentacao() {
      if (this.formMovimentacao.id) {
        // Update existing movimentacao
        const index = this.movimentacoes.findIndex(m => m.id === this.formMovimentacao.id);
        this.movimentacoes[index] = { ...this.formMovimentacao };
      } else {
        // Add new movimentacao
        const newId = this.movimentacoes.length + 1;
        this.movimentacoes.push({ ...this.formMovimentacao, id: newId });
      }
      this.limparFormulario();
    },
    editarMovimentacao(movimentacao) {
      this.formMovimentacao = { ...movimentacao };
    },
    excluirMovimentacao(id) {
      this.movimentacoes = this.movimentacoes.filter(m => m.id !== id);
    },
    limparFormulario() {
      this.formMovimentacao = {
        id: null,
        nome: null,
        data: null,
        descricao: null,
        valor: null,
      };
    }
  },
  async mounted() {
    const { data } = await api.get('/movimentacao/all');
    this.movimentacoes = data;
  }
}
</script>

<template>
  <div class="movimentacao-view">
    <h1>Cadastro de Movimentações</h1>

    <form @submit.prevent="salvarMovimentacao">
      <div>
        <label for="nome">Nome:</label>
        <input id="nome" v-model="formMovimentacao.nome" required>
      </div>
      <div>
        <label for="data">Data:</label>
        <input id="data" type="date" v-model="formMovimentacao.data" required>
      </div>
      <div>
        <label for="descricao">Descrição:</label>
        <textarea id="descricao" v-model="formMovimentacao.descricao"></textarea>
      </div>
      <div>
        <label for="valor">Valor:</label>
        <input id="valor" type="number" step="0.01" v-model="formMovimentacao.valor" required>
      </div>
      <button type="submit">Salvar</button>
    </form>

    <h2>Lista de Movimentações</h2>
    <table>
      <thead>
      <tr>
        <th>Nome</th>
        <th>Data</th>
        <th>Descrição</th>
        <th>Valor</th>
        <th>Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="movimentacao in movimentacoes" :key="movimentacao.id">
        <td>{{ movimentacao.nome }}</td>
        <td>{{ movimentacao.data }}</td>
        <td>{{ movimentacao.descricao }}</td>
        <td>{{ movimentacao.valor }}</td>
        <td>
          <button @click="editarMovimentacao(movimentacao)">Editar</button>
          <button @click="excluirMovimentacao(movimentacao.id)">Excluir</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.movimentacao-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

form div {
  display: flex;
  flex-direction: column;
}

input, textarea {
  padding: 5px;
  margin-top: 5px;
}

button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>