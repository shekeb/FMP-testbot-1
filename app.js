var express = require('express');
var app = express();
var request2 = require('request');
var bodyParser = require('body-parser');
var token = "CAAOJkZAMM1IEBAKRjKQ2YsuP79hfoDdoLcMpK8dp9zVKcOZBSh5JkIwaRZAetry9CkmTE46GltGfU0o0KL8MNn6g4cEN4n4HJgorxWNZBsCQat4cHUKF4Bl9GLwZAXi6lDGHYlpYXMpZCHFHlOrLXCeT71NNbus9N17pHafqZApemJzfZAnOKqEvseQGxSnNlN8ZD";
            
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
