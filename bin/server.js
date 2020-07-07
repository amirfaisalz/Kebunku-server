const app = require('../app.js');
const http = require('http');
const { Expo } = require('expo-server-sdk');
const expo = new Expo();
const cron = require('node-cron');
const UserPlant = require('../models/UserPlantModel.js');
const User = require('../models/usermodel.js');
const moment = require('moment');

cron.schedule('* * * * *', async () => {
  UserPlant.find()
    .populate('UserId')
    .populate('PlantId')
    .exec((err, res) => {
      let pushTokens = [];
      for(let i = 0; i < res.length; i++) {
        const start = moment(res[i].planted_date);
        const last_watered = moment(res[i].last_watering);
        const today = moment();
        const age = today.diff(start, 'days');
        const checkwatered = today.diff(last_watered, 'hours');
        if(checkwatered >= res[i].water_reminder) {
          res[i].watered = false;
        }
        res[i].plant_age = age;

        res[i].save();
        if(res[i].UserId.pushToken && res[i].watered == false) {
          pushTokens.push(res[i].UserId.pushToken);
        }
      }
      let notifications = [];
      for(let pushToken of pushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
          console.error(`Push token ${pushToken} is not a valid Expo push token`);
          continue;
        }
        notifications.push({
          to: pushToken,
          sound: "default",
          title: 'Waktunya Menyiram!',
          body: 'Tanaman anda perlu disiram, nih',
          data: { message: 'waktunya menyiram!' }
        });
      }
  
      let chunks = expo.chunkPushNotifications(notifications);
      let tickets = [];
      (async () => {
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            console.log(ticketChunk);
            tickets.push(...ticketChunk);
          } catch (error) {
            console.error(error);
          }
        }
      })();
    });
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
