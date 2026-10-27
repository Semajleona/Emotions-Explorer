const { ObjectID } = require("mongodb");

module.exports = function (app, passport, db) {

  // HOME PAGE - GO DIRECTLY TO PROFILE
  app.get('/', function (req, res) {
    res.redirect('/profile');
  });


  // PROFILE SECTION
  app.get('/profile', function (req, res) {

    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err);

      db.collection('scenarios').find().toArray((err, scenarios) => {
        if (err) return console.log(err);

        res.render('profile.ejs', {
          user: req.user || null,
          messages: result,
          scenarios: scenarios
        });

      });
    });
  });


  // CAREGIVER SCENARIOS - CREATE
  app.post('/scenarios', (req, res) => {

    db.collection('scenarios').insertOne({
      scenario: req.body.scenario
    }, (err, result) => {

      if (err) return console.log(err);

      console.log('Scenario saved to database');
      res.redirect('/profile');

    });
  });


  // CAREGIVER SCENARIOS - EDIT
  app.post('/scenarios/edit', (req, res) => {

    db.collection('scenarios').findOneAndUpdate(
      {
        _id: ObjectID(req.body.id)
      },
      {
        $set: {
          scenario: req.body.scenario
        }
      },
      (err, result) => {

        if (err) return console.log(err);

        res.redirect('/profile');

      }
    );
  });


  // CAREGIVER SCENARIOS - DELETE
  app.post('/scenarios/delete', (req, res) => {

    db.collection('scenarios').findOneAndDelete(
      {
        _id: ObjectID(req.body.id)
      },
      (err, result) => {

        if (err) return console.log(err);

        res.redirect('/profile');

      }
    );
  });


  // MESSAGE BOARD - CREATE
  app.post('/messages', (req, res) => {

    db.collection('messages').save({
      name: req.body.name,
      msg: req.body.msg,
      thumbUp: 0,
      thumbDown: 0
    }, (err, result) => {

      if (err) return console.log(err);

      console.log('Message saved to database');
      res.redirect('/profile');

    });
  });


  // MESSAGE BOARD - THUMBS UP
  app.put('/messages', (req, res) => {

    db.collection('messages').findOneAndUpdate(
      {
        name: req.body.name,
        msg: req.body.msg
      },
      {
        $set: {
          thumbUp: req.body.thumbUp + 1
        }
      },
      {
        sort: { _id: -1 },
        upsert: true
      },
      (err, result) => {

        if (err) return res.status(500).send(err);

        res.send(result);

      }
    );
  });


  // MESSAGE BOARD - THUMBS DOWN
  app.put('/messages/down', (req, res) => {

    db.collection('messages').findOneAndUpdate(
      {
        name: req.body.name,
        msg: req.body.msg
      },
      {
        $set: {
          thumbDown: req.body.thumbDown + 1
        }
      },
      {
        sort: { _id: -1 },
        upsert: true
      },
      (err, result) => {

        if (err) return res.status(500).send(err);

        res.send(result);

      }
    );
  });


  // MESSAGE BOARD - DELETE
  app.delete('/messages', (req, res) => {

    db.collection('messages').findOneAndDelete(
      {
        name: req.body.name,
        msg: req.body.msg
      },
      (err, result) => {

        if (err) return res.status(500).send(err);

        res.send('Message deleted!');

      }
    );
  });

};