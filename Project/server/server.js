const { Configuration, OpenAIApi } = require("openai");

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
  });

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

const GPT35TurboMessage = [
  { role: "system",
    content: "Explain Computer Science like im 5 in 2 sentences.",
  },
];

let GPT35Turbo = async (message) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: message,
    max_tokens: 75
  });

  return response.data.choices[0].message.content;
};

(async () => { console.log(await GPT35Turbo(GPT35TurboMessage)) })();