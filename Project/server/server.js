const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const bparse = require('body-parser');
const cors = require('cors');
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const videoIntelligence = require('@google-cloud/video-intelligence');

// The ID of your GCS bucket
const bucketName = 'vid_buck';

// The path to your file to upload
// const filePath = 'path/to/your/file';

// The new ID for your GCS file
const destFileName = 'video';

// Creates a client
const storage = new Storage();

async function uploadFile() {
  const options = {
    destination: destFileName,
    // Optional:
    // Set a generation-match precondition to avoid potential race conditions
    // and data corruptions. The request to upload is aborted if the object's
    // generation number does not match your precondition. For a destination
    // object that does not yet exist, set the ifGenerationMatch precondition to 0
    // If the destination object already exists in your bucket, set instead a
    // generation-match precondition using its generation number.
    preconditionOpts: { ifGenerationMatch: generationMatchPrecondition },
  };

  await storage.bucket(bucketName).upload(filePath, options);
  console.log(`${filePath} uploaded to ${bucketName}`);
}

//uploadFile().catch(console.error);

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


async function imageToText() {
  const fileName = 'text.jpg';
  // Performs text detection on the local file
  const [result] = await client.textDetection(fileName);
  const detections = result.textAnnotations;
  console.log('Text:');
  detections.forEach(text => console.log(text));
}

//imageToText()

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

//MongoDB
const { error } = require('console');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://DevinBarger:kwChw0RJeEZ3C4Bp@cluster0.rme8xjc.mongodb.net/ELI?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const dbclient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let currentInput;
let currentOutput;
let knowledgeLevel;
let votes;
let currentRecord;

const entriesTable = dbclient.db("ELI").collection("Entries");
//MongoDB

app.listen(PORT, () => {
  console.log(`Eli listening on port ${PORT}. He hears you when you're sleeping... Shhhhhhh`)
})



// ChatGPT REST endpoint
app.get('/chat', (req, res) => {
  const query = req.query.q;
  const level = req.query.l;
  const levelArray = ["5 years old", "in high school", "in college", "an expert"];
  console.log(query)
  console.log(level);

  // Inject query text into formatted question
  let content = "Explain " + query + " as if I was " + levelArray[level] + " in two sentences.";
  console.log(content)

  //MongoDB START

  async function searchForInput() {
    try {
      currentInput = query.toLowerCase();
      // Connect the client to the server	(optional starting in v4.7)
      await dbclient.connect().then(async () => {
        await entriesTable.find({
          $and: [
            {input: currentInput}, 
            {knowledgeLevel: level}]}).toArray()
          .then((search) => {
            if(search.length > 0) { //if exists
              currentRecord = search[0];
              votes = search[0].likes;  
              currentOutput = search[0].output
                res.send(currentOutput);
                votes = parseInt(search[0].likes);
            } else { // if it does not 
                  GPT35Turbo(GPT35TurboMessage).then((answer) => {
                    currentRecord = 
                    currentOutput = answer;
                    res.send(answer);
                  }).then(async () => {
                    addNewInput().then(async () => {
                      votes = 0;
                      await dbclient.close();
                    }).catch(console.dir);
                  });
            }
        })
      });

    } finally {
      // Ensures that the client will close when you finish/error
    }
  }

async function addNewInput() {
    await entriesTable.insertOne(
        {
            input: currentInput,
            output: currentOutput,
            knowledgeLevel: level,
            likes: 0
        }
    );
  }

  
  //MongoDB END

  const GPT35TurboMessage = [
    {
      role: "system",
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

  searchForInput();
})

app.get("/like", (req, res) => {
  const level = req.query.l;
  const query = req.query.q;
  currentInput = query;
  const vote = req.query.v;

  async function setLike() {
    try {
      await dbclient.connect()
      .then(async () => {
        votes = (parseInt(votes) + parseInt(vote));
        await entriesTable.updateOne(
          {
            $and: [
              {input: currentInput}, 
              {knowledgeLevel: level}]}, { $set: { likes: votes } }
              ) })
      .then(async () => {
        console.log("votes: " + votes)
        if (votes <= 0) {
          await entriesTable.deleteOne({
            $and: [
              {input: currentInput}, 
              {knowledgeLevel: level}]})}
        }).then(async () => {
          await dbclient.close()
          res.send("Success")
        });
          // Ensures that the client will close when you finish/error
      } finally {}
    }

  setLike();
});

