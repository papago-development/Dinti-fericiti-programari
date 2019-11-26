// Import the Firebase SDK for Google Cloud Fnctions
const functions = require('firebase-functions');

//Import and initialize the Firebase Admin SDK
const admin = require('firebase-admin');
admin.initializeApp();

// IMport and initialize the SendGrid SKD
const sendgridMail = require('@sendgrid/mail');
const sendgrid_API_KEY = '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';
sendgridMail.setApiKey(sendgrid_API_KEY);

const cors = require('cors')({origin: true});

exports.sendEmail = functions.https.onRequest((req, res) => {
    const currentDay = new Date();
    console.log('This day' + currentDay);
    currentDay.setDate(currentDay.getDate() - 1);
    console.log('This day 2' + currentDay);

    var db = admin.firestore();
    db.collection('Pacienti').where('start', '<', currentDay).get()
      .then(snap => {
        snap.forEach(childSnap => {
          const mail = childSnap.data().emailPacient;
          console.log('Mail', mail);
          const msg = {
            from: 'irimescu.mariaalexandra@yahoo.com',
            to: mail,
            subject: 'Programare',
            html: `<p>Test</p>`
          }
          sendgridMail.send(msg)
                      .then(() => console.log("Sended"))
                      .catch(err => console.log(err));
        })
      }).catch(err => console.log('Error ', err));
});

// exports.newUsers = functions.firestore.document('Users/{userId}').onCreate((snap, context) => {
//   const data = snap.data();
//   console.log('Data', data);
//   var db = admin.firestore();
//   const msg = {
//     to: 'irimescu.mariaalexandra@yahoo.com',
//     from: data.username,
//     subject: `Test`,
//     text: `Programare noua`,
//     html: `<strong></strong>`
//   };
//   sendgridMail.send(msg);
// //  db.collection('Users').get().then(snap => {
// //     snap.forEach(childSnap => {
// //       const email = childSnap.data().username;
// //        const msg = {
// //          to: email,
// //          from: 'irimescu.marialexandra@yahoo.com',
// //          subject: `Test`,
// //          text: `Programare noua`,
// //          html: `<strong></strong>`
// //        };
// //        sendgridMail.send(msg);
// //     });
// //   });
//   return true;
// });
// const email = snap.data().username;
//   const msg = {
//     to: email,
//     from: 'test@yahoo.com',
//     subject: `Test`,
//     text: `Programare noua`,
//     html: `<strong></strong>`
//   };
//   return sendgridMail.send(msg);
// });
