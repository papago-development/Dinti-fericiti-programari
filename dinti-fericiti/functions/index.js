// Import the Firebase SDK for Google Cloud Fnctions
const functions = require('firebase-functions');

//Import and initialize the Firebase Admin SDK
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firestore);

// IMport and initialize the SendGrid SKD
const sendgridMail = require('@sendgrid/mail');
// const sendgrid_API_KEY = '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';
const sendgrid_API_KEY = functions.config().sendgrid.key;
sendgridMail.setApiKey(sendgrid_API_KEY);

const cors = require('cors')({ origin: true });

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

    const currentDay = new Date();
    currentDay.setDate(currentDay.getDate());

    var db = admin.firestore();
    db.collection('Pacienti').where('start', '>=', currentDay).get()
      .then(snap => {
        snap.forEach(childSnap => {
          const mail = childSnap.data().emailPacient;
          var namePatient = childSnap.data().name;
          var startDate = childSnap.data().start.toDate();
          var doctor = childSnap.data().medic;
          var appointmentDate = new Date(startDate.toString());
          var currentDayDate = currentDay.getTime()
          var timeDiff = appointmentDate - currentDayDate;
          var day = Math.round(Math.abs(timeDiff / (1000 * 60 * 60 * 24)));

          // If difference between appointment date and currentDay is 1, then
          // will send email
          if (day === 1) {
            const msg = {
              to: mail,
              from: 'dintifericiti@gmail.com',
              subject: 'Programare',
              templateId: 'd-7d9af200ea684e26b697f0cd693b713f',
              substitutionWrappers: ['{{', '}}'],
              dynamicTemplateData: {
                name: namePatient,
                data: new Date(startDate).toLocaleDateString(),
                ora: new Date(startDate).toLocaleTimeString(),
                medic: doctor
              }
            }
            return sendgridMail.send(msg)
              .then(() => {
                console.log("Sended to:" + mail);
                res.status(200).send('ok');
              })
              .catch(err => {
                console.log(err);
              });
          }
        })
      }).catch(err => {
        console.error('Error ', err.toString());
      }).catch(err => console.error(err));
  });
});
