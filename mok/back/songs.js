const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();
const users = require("./users.js");

const User = users.model;
const validUser = users.valid;

const songSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  title: String,
  data: String,
  allData: Array,
  comments: Array,
  username: String,
  bpm: Number,
  created: {
    type: Date,
    default: Date.now
  },
});

const Song = mongoose.model('Song', songSchema);

// get songs -- will list songs that a user has
router.get('/', validUser, async (req, res) => {
  let songs = [];
  try {
    if (req.user.role === "admin") {
      songs = await Song.find().sort({
        created: -1
      });
    } else {
      songs = await Song.find({
        user: req.user
      }).sort({
        created: -1
      });
    }
    return res.send({
      songs: songs
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});

// gets all songs
router.get('/all', async (req, res) => {
  let songs = [];
  try {

      songs = await Song.find().sort({
        created: -1
      });
    return res.send({
      songs: songs
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


// create a "song"
router.post('/', validUser, async (req, res) => {
  const song = new Song({
    user: req.user,
    username: req.user.username,
    bpm: 120,
    title: req.body.title,
  });
  try {
    await song.save();
    return res.send({
      song: song
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


// edits a song -- only edits status and response
router.put('/:id', validUser, async (req, res) => {
  // can only do this if an administrator
  /*if (req.user.role !== "admin") {
    return res.sendStatus(403);
  }*/

  try {
    song = await Song.findOne({
      _id: req.params.id
    });
    if(req.user._id+"" == song.user+""){// Makes sure that the user is the creator of the song

      song.title = req.body.song.title;
      song.data = req.body.song.data;
      song.bpm = req.body.song.bpm;
      song.allData = req.body.song.allData;

      await song.save();
      return res.send({
        song: song
      });

      }else{
          return res.sendStatus(500);
      }

  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
});


router.delete("/:id", validUser, async (req, res) => {
  try {
    song = await Song.findOne({
      _id: req.params.id
    });

    if(req.user._id+"" == song.user+""){// Makes sure that the user is the creator of the song
      await Song.deleteOne({
        _id: req.params.id
      });
      return res.sendStatus(200);
    }else{
      return res.sendStatus(500);
    }

  } catch (error) {
    return res.sendStatus(500);
    console.log(error);
  }
});







module.exports = {
  routes: router
}
