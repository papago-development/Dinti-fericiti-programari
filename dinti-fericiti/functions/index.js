// Import the Firebase SDK for Google Cloud Fnctions
const functions = require('firebase-functions');

//Import and initialize the Firebase Admin SDK
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firestore);

// IMport and initialize the SendGrid SKD
const sendgridMail = require('@sendgrid/mail');
 const sendgrid_API_KEY = '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';
//const sendgrid_API_KEY = functions.config().sendgrid.key;
sendgridMail.setApiKey(process.env.sendgrid_API_KEY);

// const cors = require('cors')({origin: true});

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
          to: 'testasoft.mkt@gmail.com',
          from: 'irimescu.mariaalexandra@gmail.com',
          subject: 'Programare',
          templateId: 'd-7d9af200ea684e26b697f0cd693b713f',
          substitutionWrappers: ['{{', '}}'],
          substitutions: {
            name: childSnap.data().name,
            medic: childSnap.data().medic,
            start: childSnap.data().start
          }
        }
        return sendgridMail.send(msg)
          .then(() => {
            console.log("Sended");
            res.status(200).send('ok');
          })
          .catch(err => {
            console.log(err);
          });
      })
    }).catch(err => {
      console.error('Error ', err.toString());

    });
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
