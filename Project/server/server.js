const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const bparse = require('body-parser');
const cors = require('cors');
const vision = require('@google-cloud/vision');
const {Storage} = require('@google-cloud/storage');



// async function authenticateImplicitWithAdc() {

//   // This snippet demonstrates how to list buckets.
//   // NOTE: Replace the client created below with the client required for your application.
//   // Note that the credentials are not specified when constructing the client.
//   // The client library finds your credentials using ADC.
//   const storage = new Storage({
//     auth: (process.env.GCP_API_KEY),
//   });
//   const [buckets] = await storage.getBuckets();
//   console.log('Buckets:');

//   for (const bucket of buckets) {
//     console.log(`- ${bucket.name}`);
//   }

//   console.log('Listed all storage buckets.');
// }

// authenticateImplicitWithAdc();
// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: "key.json"
});


async function ImageToText() {
/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
// const fileName = 'Local image file, e.g. /path/to/image.png';
const fileName = 'text.jpg';
// Performs text detection on the local file
const [result] = await client.textDetection(fileName);
const detections = result.textAnnotations;
console.log('Text:');
detections.forEach(text => console.log(text));
}

ImageToText()

// Express application
const app = express()
const PORT = 3000;

app.use(cors())
app.use(bparse.urlencoded({ extended: false }));
app.use(bparse.json());

// OpenAI Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
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