<template>
  <div class="chat-ai">
    <h2>Assistente de Movimentações</h2>

    <div ref="messagesWrap" class="messages">
      <div v-for="(m, idx) in messages" :key="idx" :class="['message', m.role]">
        <div class="bubble">
          <div class="role">{{ m.role === 'user' ? 'Você' : 'Assistente' }}</div>
          <div class="text" v-if="m.role === 'assistant'" v-html="renderMarkdown(m.content)"></div>
          <div class="text" v-else>{{ m.content }}</div>
        </div>
      </div>
      <div v-if="loading" class="message assistant">
        <div class="bubble">
          <div class="role">Assistente</div>
          <div class="text">Escrevendo...</div>
        </div>
      </div>
    </div>

    <form class="composer" @submit.prevent="sendMessage">
      <textarea
          v-model="inputText"
          placeholder="Escreva sua mensagem (ex: 'Crie uma movimentação compra nome 'X' 2025-08-12 valor 1000')"
      @keydown.enter.exact.prevent="sendMessage"
      rows="2"
      ></textarea>
      <div class="actions">
        <button type="button" @click="clearChat">Limpar</button>
        <button :disabled="sending" type="submit">{{ sending ? 'Enviando...' : 'Enviar' }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import {nextTick} from 'vue';
import {chatCompletion} from "@/plugins/ai.js";
import {marked} from "marked";
import DOMPurify from "dompurify";

export default {
  name: 'ChatAi',
  data() {
    return {
      messages: [
      ],
      inputText: '',
      loading: false,
      sending: false,
    }
  },
  methods: {
    renderMarkdown(text) {
      const renderer = new marked.Renderer();
      renderer.link = ({href, text}) =>
          `<a href="${href}" target="_blank" >${text}</a>`;
      marked.setOptions({ renderer });

      let html = marked.parse(text || "");
      html = DOMPurify.sanitize(html, {
        ADD_ATTR: ['target']
      });
      return html
    },
    async sendMessage() {
      const text = (this.inputText || '').trim();
      if (!text) return;

      // push usuário localmente
      this.messages.push({ role: 'user', content: text });
      this.inputText = '';
      this.sending = true;
      this.loading = true;

      await this.scrollToBottom();

      try {
        const response = await chatCompletion(text)
        this.messages.push({ role: 'assistant', content: response.output });
        await this.scrollToBottom();

      } catch (err) {
        console.error(err);
        this.messages.push({ role: 'assistant', content: 'Erro ao contactar o servidor: ' + (err?.message || String(err)) });
        await this.scrollToBottom();
      } finally {
        this.sending = false;
        this.loading = false;
      }
    },

    clearChat() {
      this.messages = [
          // { role: 'assistant', content: 'Olá — posso criar movimentações para você. Diga o que deseja.' }
      ];
    },

    async scrollToBottom() {
      await nextTick();
      const wrap = this.$refs.messagesWrap;
      if (wrap) wrap.scrollTop = wrap.scrollHeight;
    }
  },
  mounted() {
    console.log(import.meta.env)
    this.scrollToBottom();
  }
}
</script>

<style scoped>
.chat-ai {
  max-width: 720px;
  margin: 20px auto;
  padding: 16px;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  background: #fff;
}

h2 {
  margin: 0 0 12px 0;
}

.messages {
  height: 360px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background: #fafafa;
}

.message {
  display: flex;
}

.message.user {
  justify-content: flex-end;
}

.message.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.message.user .bubble {
  background: #dcf8c6;
}

.role {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.text {
  white-space: pre-wrap;
}

.composer {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

textarea {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  resize: vertical;
  min-height: 44px;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

button {
  padding: 8px 12px;
  border-radius: 6px;
  border: 0;
  cursor: pointer;
}

button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
