var express = require('express');
var app = express();
var request2 = require('request');
var bodyParser = require('body-parser');
var token = "CAASMniZCTo9cBAFSwKtCLIXoLSHocQQAqDYpnoZC5WWFBK9preQuNY7fzGHTmj0ARCaxZBPePZCxgHRgwTbV1ZCVOlp8k692I2ZAID5fBGk29t1tSCBzgvGenB1G4h0m9HLKOW4WEBfQpUjivAEZBxaZBPnVSGHSzZCCGNEZB6JK86PdEef3pQBOjXbafA8YexQzYZD";
            
app.use(bodyParser.json())  // will auto parse JSON. from github.com/expressjs/body-parser


// Test
app.get('/hello', function(req, res) {
  res.send('world');
});

// To verify
app.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === 'super-secrit2') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});


function sendTextMessage(sender, text) {
  console.log('we are in sendToMessage');
  messageData = {
    text:text
  }
  request2({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}


// Should do the things we want to do
app.post('/webhook', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      var text = event.message.text;
      // Handle a text message from this sender
      console.log(text);
      sendTextMessage(sender, "Text received was: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});


app.listen(process.env.PORT || 3000);
