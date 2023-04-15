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
let currentInput = "";
let currentOutput = "";
let search = [];

async function searchForInput() {
    try {
      //currentInput = what user types in
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      await entriesTable.find(
          {input: currentInput}, {$exists: true}).toArray()
          .then((search) => {
            console.log("searching...");
            if(search.length > 0) { //if exists
                currentOutput = search[0].output
                console.log(search[0].output)
                //Display on site
            } else { // if it does not 
                addNewInput().catch(console.dir);
            }
        });
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
}

async function addNewInput() {
    await entriesTable.insertOne(
        {
            input: currentInput, //put user input here
            output: currentOutput, //put ai output here
            likes: 0
        }
    );
}

async function vote() {
    //if(upvote){
    await entriesTable.updateOne({input: currentInput}, {$set: {likes: likes + 1}});
    //if(downvote){
    await entriesTable.updateOne({input: currentInput}, {$set: {likes: likes - 1}});
    if(currentInput.likes < 0) entriesTable.deleteOne(currentInput);
}