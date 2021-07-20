const express = require('express');
//line config
const line = require('@line/bot-sdk');
const config = {
    channelAccessToken: 'qsiPR8r8yQXxGTAhWCh31fpVUd9NqI/POxJOGeZvc1etfqblqeyCsn8TfUcy06myp9/9L5lxHSEYihvjRrr3INN1iDVuWIsNw1InTwsCdtrqb3LPfatScCRQ0ha9ViXfgxQ7X4S+3D4qvOhCVbbsQQdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'aa066dacadb4ce2f335b5b3ddb93473e'
};
const client = new line.Client(config);
//FIREBASE
const firebase = require('firebase');
require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyAwr-1ljoXoj3fkNwwnCo2bifjontTuK6M",
    authDomain: "lineoa-c420a.firebaseapp.com",
    projectId: "lineoa-c420a",
    storageBucket: "lineoa-c420a.appspot.com",
    messagingSenderId: "807604942358",
    appId: "1:807604942358:web:9459242485308cbfbb2737",
    measurementId: "G-ZJYZFL63YE"
} 
const admin = firebase.initializeApp(firebaseConfig);
const db = admin.firestore();

//WEB
const app = express();
const port = 3000
app.post('/webhook', line.middleware(config), (req, res) => {
    //console.log(req);
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});

async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    //console.log(event);
    //console.log(event.message);
    //console.log(event.message.text);
    // SAVE TO FIREBASE
    let chat = await db.collection('chats').add(event);
    console.log('Added document with ID: ', chat.id);
    

    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: event.message.text,
    });
}



// Respond with Hello World! on the homepage:
app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.post('/', function (req, res) {
    res.send('Got a POST request')
})

app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
})

app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
})

app.get('/test-firebase', async function (req, res) {
    let data = {
        name: 'Bankok',
        country: 'Thailand'
    }
    const result = await db.collection('cities').add(data);
    console.log('Added document with ID: ', result.id);
    res.send('Test firebase successfully, check your firestore for a new record !!!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
