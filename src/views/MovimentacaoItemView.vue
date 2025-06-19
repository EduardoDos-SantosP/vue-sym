<template>
  <div class="movimentacao-itens-view">
    <h1>Itens da Movimentação #{{ id }}</h1>

    <!-- Formulário de inclusão/edição de item -->
    <form @submit.prevent="salvarItem">
      <div>
        <label for="nome-item">Nome:</label>
        <input id="nome-item" v-model="formItem.nome" required />
      </div>
      <div>
        <label for="descricao-item">Descrição:</label>
        <input id="descricao-item" v-model="formItem.descricao" />
      </div>
      <div>
        <label for="valor-item">Valor:</label>
        <input id="valor-item" type="number" v-model.number="formItem.valor" required />
      </div>
      <button type="submit">Salvar</button>
      <button :disabled="!formItem.id" type="button" @click="limparForm">Cancelar</button>
    </form>

    <!-- Tabela de itens -->
    <h2>Lista de Itens</h2>
    <table>
      <thead>
      <tr>
        <th>Nome</th>
        <th>Valor</th>
        <th>Ações</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in itens" :key="item.id">
        <td>{{ item.nome }}</td>
        <td>{{ item.valor }}</td>
        <td>
          <button @click="editarItem(item)">Editar</button>
          <button @click="excluirItem(item.id)">Excluir</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { api } from "@/api.js"
export default {
  name: 'MovimentacaoItensView',
  props: ['id'],        // recebe id da movimentação
  data() {
    return {
      itens: [],
      formItem: { id: null, nome: '', descricao: '', valor: null },
    };
  },
  methods: {
    async carregarItens() {
      // chamar API para buscar itens de this.id
      const response = await api.get(`/movimentacao/items/${this.id}`)
      console.log(response)
      this.itens = response.data.items
    },
    async salvarItem() {
      if (this.formItem.id) {
        // PUT /movimentacao/:id/itens/:itemId
      } else {
        const payload = this.formItem
        delete payload.id
        const response = await api.post(`/movimentacao/${this.id}/items/save`, payload)
        const item =  response.data;
        if (!item.id) {
          console.log(item)
          return alert(response.statusText)
        }
        this.itens.push(item)
      }
      await this.carregarItens();
      this.limparForm();
    },
    editarItem(item) {
      this.formItem = { ...item };
    },
    async excluirItem(itemId) {
      const opt = prompt('Tem certeza que deseja excluir esse item? (s/n)')
      if (opt.toLowerCase() !== 's') return;

      const response = await api.delete('/movimentacao/delete/' + itemId)
      if (response.status !== 200) {
        console.error(response.data)
        return alert(response.statusText)
      }
      this.itens.splice(
          this.itens.findIndex(i => i.id === itemId),
          1
      )
    },
    limparForm() {
      this.formItem = { id: null, nome: '', descricao: '', valor: null };
    },
  },
  mounted() {
    this.carregarItens();
  },
};
</script>

<style scoped>
.movimentacao-itens-view {
  max-width: 800px;
  margin: 20px auto;
  padding: 16px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}
input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 8px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #45a049;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background: #f2f2f2;
  text-align: left;
}
</style>
