import React from 'react'

const GetGPT = (query) => {
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
      apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);

  async function openaiTest() {
      const response = await openai.createCompletion({
          model: "gpt-3.5-turbo",
          prompt: query + "\n",
          temperature: 0.7,
          max_tokens: 100,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
        })
      console.log(response.data.choices)
  }

  openaiTest()
}

export default GetGPT