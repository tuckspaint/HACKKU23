const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const bparse = require('body-parser');
const cors = require('cors');

// Express application
const app = express()
const PORT = 3000;

app.use(cors())
app.use(bparse.urlencoded({ extended: false }));
app.use(bparse.json());

// OpenAI Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

app.listen(PORT, () => {
  console.log(`Eli listening on port ${PORT}. He hears you when you're sleeping... Shhhhhhh`)
})

// ChatGPT REST endpoint
app.get('/chat', (req, res) => {
  const query = req.query.q;
  console.log(query)

  // Inject query text into formatted question
  let content = "Explain " + query + " as if I was five years old in two sentences.";
  console.log(content)

  const GPT35TurboMessage = [
    { role: "system",
      content: content, 
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

  GPT35Turbo(GPT35TurboMessage).then(answer => {
    res.send(answer);
    console.log(answer);
  });

})