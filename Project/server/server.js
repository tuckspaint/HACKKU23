const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const bparse = require('body-parser');
const cors = require('cors');
const vision = require('@google-cloud/vision');
const { Storage } = require('@google-cloud/storage');
const videoIntelligence = require('@google-cloud/video-intelligence');
const multer = require('multer');
const { parse } = require("path");

// Creates a client
const client = new vision.ImageAnnotatorClient({
  keyFilename: "key.json"
});


//imageToText()

// Express application
const app = express()
const PORT = 3000;

app.use(cors())
app.use(bparse.urlencoded({ extended: false, limit: '50mb' }));
app.use(bparse.json({limit: '50mb'}));

// OpenAI Configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.listen(PORT, () => {
  console.log(`Eli listening on port ${PORT}. He hears you when you're sleeping... Shhhhhhh`)
})


const store = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'tmp/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: store })

app.use(cors())

let GPT35Turbo = async (str) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: str,
      },
    ],
    max_tokens: 75
  });

  return response.data.choices[0].message.content;
};

app.post('/video', upload.single('file'), (req, res) => {
  const path = req.file.path;
  const level = req.query.l;
  const levelArray = ["5 years old", "in high school", "in college", "an expert"];
  const bucketName = 'vid_buck';
  // The new ID for your GCS file
  const destFileID = "video.mp4";
  
  console.log(path)

  // Inject query text into formatted question
  var query = "";
  // Performs text detection on the local file
  // The ID of your GCS bucket
  // The path to your file to upload

  // Creates a client
  const storage = new Storage({
    keyFilename: "key.json",
  });

  async function uploadFile() {
    const options = {
      destination: destFileID,
    };

    await storage.bucket(bucketName).upload(path, options).then(() => {
      console.log(`${path} uploaded to ${bucketName}`);
    })
  }

  // Creates a client
  const videoClient = new videoIntelligence.VideoIntelligenceServiceClient({
    keyFilename: "key.json",
  });

  const gcsUri = 'gs://vid_buck/video.mp4';
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
        query += alternative.transcript + ' ';
      }
    } 
  }
  
  uploadFile().then(() => {
    analyzeVideoTranscript().then(() => {
      let content = "Explain " + query + " as if I was " + levelArray[level] + " in two sentences.";
      console.log(content);
      GPT35Turbo(content).then(a => {
        res.send(a)
        console.log(a)
      })
    })
  }); 
});

// Image text recognition REST endpoint
app.post('/image', upload.single('file'), (req, res) => {
  console.log(req.file.path);
  const fileName = req.file.path;
  const level = req.query.l;
  const levelArray = ["5 years old", "in high school", "in college", "an expert"];
  // console.log(query)
  // console.log(level);

  // Inject query text into formatted question
  var query = "";

  (async () => {
    // Performs text detection on the local file
    const [result] = await client.textDetection(fileName);
    const detections = result.textAnnotations;
    detections.forEach(text => {
      query += text.description + ' ';
    });
  })().then(() => {
    let content = "Explain " + query + " as if I was " + levelArray[level] + " in two sentences.";
    console.log(content);
    GPT35Turbo(content).then(a => {
      res.send(a)
      console.log(a)
    })
  })
});

// ChatGPT REST endpoint
app.get('/chat', (req, res) => {
  const query = req.query.q;
  const level = req.query.l;
  const levelArray = ["5 years old", "in high school", "in college", "an expert"];
  // console.log(query)
  // console.log(level);

  // Inject query text into formatted question
  let content = "Explain " + query + " as if I was " + levelArray[level] + " in two sentences.";
  console.log(content)

  //MongoDB START
  const { error } = require('console');
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb+srv://DevinBarger:kwChw0RJeEZ3C4Bp@cluster0.rme8xjc.mongodb.net/ELI?retryWrites=true&w=majority";

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  const entriesTable = client.db("ELI").collection("Entries");
  let currentInput;
  let currentOutput;
  let knowledgeLevel;

  async function searchForInput() {
    try {
      currentInput = query;
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect().then(async () => {
        await entriesTable.find({
          $and: [
            {input: currentInput}, 
            {knowledgeLevel: level}]}).toArray()
          .then((search) => {
            if(search.length > 0) { //if exists
                currentOutput = search[0].output
                res.send(currentOutput);
                console.log(currentOutput); //DEVELOPER
            } else { // if it does not 
              console.log("does not exist");
                  GPT35Turbo(content).then((answer) => {
                    currentOutput = answer;
                    res.send(answer);
                    console.log(answer); //DEVELOPER
                  }).then(async () => {
                    addNewInput().then(async () => {
                      await client.close();
                      console.log("closed");
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
    console.log("in function");
      await entriesTable.insertOne(
          {
              input: currentInput,
              output: currentOutput,
              knowledgeLevel: level,
              likes: 0
          }
      );
  }

  async function vote() {
    try {
      await client.connect();
      //if(upvote){
      await entriesTable.updateOne({ input: currentInput }, { $set: { likes: likes + 1 } });
      //if(downvote){
      await entriesTable.updateOne({ input: currentInput }, { $set: { likes: likes - 1 } });
      if (currentInput.likes < 0) entriesTable.deleteOne(currentInput);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  //MongoDB END

  searchForInput();
})