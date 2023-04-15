const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const bparse = require('body-parser');
const cors = require('cors');
const vision = require('@google-cloud/vision');
const {Storage} = require('@google-cloud/storage');
const videoIntelligence = require('@google-cloud/video-intelligence');


// Creates a client
const videoClient = new videoIntelligence.VideoIntelligenceServiceClient({
  keyFilename: "key.json",
});

const gcsUri = 'gs://vid_buck/Anti-Gravity Wheel_.mp4';

async function analyzeVideoTranscript() {
  const videoContext = {
    speechTranscriptionConfig: {
      languageCode: 'en-US',
      enableAutomaticPunctuation: true,
    },
  };

  const request = {
    inputUri: gcsUri,
    features: ['SPEECH_TRANSCRIPTION'],
    videoContext: videoContext,
  };

  const [operation] = await videoClient.annotateVideo(request);
  console.log('Waiting for operation to complete...');
  const [operationResult] = await operation.promise();
  // There is only one annotation_result since only
  // one video is processed.
  const annotationResults = operationResult.annotationResults[0];

  for (const speechTranscription of annotationResults.speechTranscriptions) {
    // The number of alternatives for each transcription is limited by
    // SpeechTranscriptionConfig.max_alternatives.
    // Each alternative is a different possible transcription
    // and has its own confidence score.
    for (const alternative of speechTranscription.alternatives) {
      console.log('Alternative level information:');
      console.log(`Transcript: ${alternative.transcript}`);
      console.log(`Confidence: ${alternative.confidence}`);

      console.log('Word level information:');
      for (const wordInfo of alternative.words) {
        const word = wordInfo.word;
        const start_time =
          wordInfo.startTime.seconds + wordInfo.startTime.nanos * 1e-9;
        const end_time =
          wordInfo.endTime.seconds + wordInfo.endTime.nanos * 1e-9;
        console.log('\t' + start_time + 's - ' + end_time + 's: ' + word);
      }
    }
  }
}

//analyzeVideoTranscript();



// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: "key.json"
});


async function ImageToText() {
const fileName = 'text.jpg';
// Performs text detection on the local file
const [result] = await client.textDetection(fileName);
const detections = result.textAnnotations;
console.log('Text:');
detections.forEach(text => console.log(text));
}

//ImageToText()

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