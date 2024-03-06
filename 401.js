const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const TelegramBot = require('node-telegram-bot-api');

const token='6481580953:AAG5vR9a5QEpFsaPvF_Hz0HtFY5X-zEhm-M';

const bot = new TelegramBot(token, {polling: true});


var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();


bot.on('message', function(mg){


  const msg = mg.text;

  const newMsg = msg.split(" ")
  if(newMsg[0]=='INSERT'){
    const request = require('request');
var name = newMsg[2];
request.get({
  url: 'https://api.api-ninjas.com/v1/planets?name=' + name,
  headers: {
    'X-Api-Key': 'xfHOuUWXM4lVirUqTcHF6A==MdMHscU5D2OuUYvu'
  },
}, function(error, response, body) {
  var r=JSON.parse(body);
  var a=r[0];
  const message=a.temperature;
  if(error) return console.error('Request failed:', error);
  else if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
  else console.log(body)
    //Insert the data to database with key
    db.collection('Renu@17').add({
      key:newMsg[1],
      dataValue:message,
      userID:mg.from.id
  }).then(()=>{
    bot.sendMessage(mg.chat.id, newMsg[1] + " stored sucessfully ")
  })
  });
  }
  else if(newMsg[0]=='GET'){
    //Get the data to database with key
    db.collection('Renu@17').where('userID', '==', mg.from.id).get().then((docs)=>{
        docs.forEach((doc) => {
            bot.sendMessage(mg.chat.id, doc.data().key + " " + doc.data().dataValue)
          });
    })
  }
  else{
    bot.sendMessage(mg.chat.id, "Please make sure you keeping GET or INSERT in your message to insert the data or GET the data")
  }
 
})
