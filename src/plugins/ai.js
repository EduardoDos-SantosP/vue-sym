import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import {DynamicStructuredTool} from "@langchain/core/tools";
import {AgentExecutor, createToolCallingAgent} from "langchain/agents";
import {BufferWindowMemory} from "langchain/memory";
import {z} from "zod";
import {DateTime} from "luxon";
import {api} from "../api.js";

const OPENROUTER_API_KEY = "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";

const llm = new ChatOpenAI(
  {
    model: "deepseek/deepseek-chat-v3-0324:free",
    temperature: 0.6,
    apiKey: OPENROUTER_API_KEY,
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
    }
  }
)

const prompt = ChatPromptTemplate.fromMessages([
  ["system", `
  Você é um assistente que cria movimentações financeiras via API
  Agora são: {timestamp}
  `],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"]
])

const tools = [new DynamicStructuredTool({
  name: "http_request",
  description: "Cria movimentação. Retorne o link de acesso da movimentação criada ao usuário",
  schema: z.object({
    nome: z.string(),
    valor: z.number(),
    descricao: z.string().optional(),
    data: z.string()
      //.regex(/^\d\d-\d\d-\d\d$/)
      .describe('Formato dd-MM-yyyy')//.datetime()
  }),
  async func(dto) {
    console.log(...arguments)
    const { data } = await api.post('/movimentacao/new', {
      ...dto,
      descricao: dto.descricao ?? '',
      data: dto.data + ' 00:00'
    })
    if (data.id)
      data.link = `${import.meta.env.VITE_URL}/movimentacao/${data.id}/itens`
    console.log(data)
    return JSON.stringify(data);
  },
})]

const agent = createToolCallingAgent({ llm, prompt, tools })
const memoryKey = 'chat_history'

const memory = new BufferWindowMemory({
  memoryKey,
  inputKey: 'input',
  outputKey: memoryKey,
  k: 5,
  returnMessages: false
})

const executor = new AgentExecutor({ agent, tools, memory/*, returnIntermediateSteps: true*/ })

export async function chatCompletion(input) {
  const timestamp = DateTime.now().setLocale('pt-BR').toFormat('dd/MM/yyyy HH:mm cccc')
  const output = await executor.invoke({ input, timestamp })
  console.log({ output })
  return output
}
// chatCompletion('Crie uma movimentação com o nome "testai" e o valor 10')