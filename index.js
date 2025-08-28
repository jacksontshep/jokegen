import { ChatOpenAI } from '@langchain/openai'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { z } from "zod"
import { tool } from '@langchain/core/tools'

import { createServer } from 'http'
import express from 'express'
import { WebSocketServer } from 'ws'

const model = new ChatOpenAI({
  modelName: 'gpt-5-nano'
})

const jokeSchema = z.object({
  joke: z.string().describe('The statement that sets up for a humorous statement'),
  punchline: z.string().describe('The punch-line that resolves the joke in a humorous way')
})

const parser = StructuredOutputParser.fromZodSchema(jokeSchema)
const formatInstructions = parser.getFormatInstructions()

const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a comedian who tells succinct, funny jokes.'],
  ['human', 'Tell me a joke about {topic}.\n\n{format_instructions}']
])

const chain = prompt.pipe(model).pipe(parser)

// Expose as LangChain Tool
const generateJokeTool = tool(
  async ({ topic }) => chain.invoke({ topic, format_instructions: formatInstructions }),
  {
    name: 'generate_joke',
    description: 'Generate a joke and punchline for a given topic',
    schema: z.object({
      topic: z.string().describe('Topic to joke about')
    })
  }
)

async function generateJoke (topic) {
  try {
    const { joke, punchline } = await generateJokeTool.invoke({ topic })
    console.log('Joke:', joke)
    console.log('Punchline:', punchline)
    return {joke, punchline}
  } catch (err) {
    console.error('Failed to generate a joke:', err)
  }
}

// Backend
const app = express()
app.use(express.static('public')) // serves index.html

const server = createServer(app)
const wss = new WebSocketServer({ server, path: '/ws' })

wss.on('connection', socket => {
  socket.on('message', async raw => {
    try {
      const { command, topic } = JSON.parse(raw)
      if (command === 'generate joke') {
        const {joke, punchline} = await generateJoke(topic)
        socket.send(JSON.stringify({ joke, punchline }))
      }
    } catch (e) {
      console.error(e)
      socket.send(JSON.stringify({ joke: 'Oops, something went wrong!' }))
    }
  })
})

server.listen(2999, () => console.log('http://localhost:2999'))
