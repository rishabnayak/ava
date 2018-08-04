const record = require('node-record-lpcm16');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');

const dialogflow = require('dialogflow');

const say1 = require('say');

// Instantiates a sessison client
const sessionClient = new dialogflow.SessionsClient();

// Creates a client
const client = new speech.SpeechClient();

const http = require('http');

const req = require('request');

var url = "https://www.ehealthme.com/api/v1/drug-interaction/";
/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false, // If you want interim results, set this to true
};

function foo(inp)
{
var queries = [inp];
if (!queries || !queries.length) {
  return;
}

// The path to identify the agent that owns the created intent.
const sessionPath = sessionClient.sessionPath('monster-energy-final', '1');

let promise;

function myspeak(ghh)
{
  record.stop();
  say1.speak(ghh);
}

function logQueryResult(in1,in2)
{
  txt = in2.fulfillmentText;
  if (txt.indexOf('interaction') > -1){
    i1 = txt.indexOf('between') + 8
    i2 = txt.indexOf('and')
    i3 = txt.indexOf('can')
    drug1 = txt.substring(i1, i2-1)
    drug2 = txt.substring(i2+4, i3-1)
    url = url + drug1 +'/'+drug2+'/';
    req({
          url: url,
          json: true
        }, 
        function (error, response, body) {
          if(!body) {
            myspeak("there are no known interactions.")
              }
        else if (!error && response.statusCode === 200) {
            var femint = body.gender_interaction.female
            var maleint = body.gender_interaction.male
            var commonint = []
            var femonly = []
            var maleonly = []
          for (var int of femint) {
            if (maleint.indexOf(int) == -1)
              femonly.push(int)
            else
              commonint.push(int)
          }
          for (var int of maleint) {
            if (femint.indexOf(int) == -1)
              maleonly.push(int)
            else
              if (commonint.indexOf(int) == -1) 
                commonint.push(int)
          }

             myspeak("possible interactions common to both genders include," + commonint + ",,,,,possible interactions specific to men include," + maleonly + ",,,,,possible interactions specific to women include," + femonly);
    }
    else if(response.statusCode === 404) {
      myspeak("those alleged drugs are not known to us.")
    } 
})
  }
  else
    myspeak(txt)
}

// Detects the intent of the queries.
for (const query of queries) {
  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: 'en-US',
      },
    },
  };

  if (!promise) {
    // First query.
    //console.log(`Sending query "${query}"`);
    promise = sessionClient.detectIntent(request);
  } else {
    promise = promise.then(responses => {
      //console.log('Detected intent');
      const response = responses[0];
      logQueryResult(sessionClient, response.queryResult);

      // Use output contexts as input contexts for the next query.
      response.queryResult.outputContexts.forEach(context => {
        // There is a bug in gRPC that the returned google.protobuf.Struct
        // value contains fields with value of null, which causes error
        // when encoding it back. Converting to JSON and back to proto
        // removes those values.
        context.parameters = structjson.jsonToStructProto(
          structjson.structProtoToJson(context.parameters)
        );
      });
      request.queryParams = {
        contexts: response.queryResult.outputContexts,
      };

      //console.log(`Sending query "${query}"`);
      return sessionClient.detectIntent(request);
    });
  }
}

promise
  .then(responses => {
    //console.log('Detected intent');
    logQueryResult(sessionClient, responses[0].queryResult);
  })
  .catch(err => {
    console.error('ERROR:', err);
  });
}
// Create a recognize stream
var recognizeStream = client.streamingRecognize(request)
  .on('error', console.error)
  .on('data', data1 =>
    //process.stdout.write(
      //datap.results[0] && datap.results[0].alternatives[0]
        //? `Transcription: ${datap.results[0].alternatives[0].transcript}\n`
        //: `\n\nReached transcription time limit, press Ctrl+C\n`
        foo(data1.results[0].alternatives[0].transcript)
    );
// Start recording and send the microphone input to the Speech API



record
  .start({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: false,
    recordProgram: 'rec', // Try also "arecord" or "sox"
    silence: '10.0',
  })
  .on('error', console.error)
  .pipe(recognizeStream);

console.log('                             ###    ##     ##    ###                              ')
console.log('                            ## ##   ##     ##   ## ##                             ')
console.log('                           ##   ##  ##     ##  ##   ##                            ')
console.log('####### ####### #######   ##     ## ##     ## ##     ##   ####### ####### ####### ')
console.log('                          #########  ##   ##  #########                           ')
console.log('                          ##     ##   ## ##   ##     ##                           ')
console.log('                          ##     ##    ###    ##     ##                           ')
console.log('                          ##     ##    ###    ##     ## \n\n                      ')