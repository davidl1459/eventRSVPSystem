require('dotenv').config();
const express = require('express');
const cors = require('cors');

const inviteRoute = require('./routes/invite');
const guestRoute = require('./routes/guest');
const rsvpRoute = require('./routes/rsvp');
const eventsRoute = require('./routes/event');
const adminRoute = require('./routes/admin');
const db = require('./services/db');


const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use('/invite', inviteRoute);
app.use('/guest', guestRoute);
app.use('/rsvp', rsvpRoute);
app.use('/events', eventsRoute);
app.use('/admin', adminRoute);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});



(async () => {
  const [result] = await db.query('SELECT 1');
  console.log(' MySQL connected:', result);
})();

