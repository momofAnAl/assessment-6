const express = require("express");
const bots = require("./src/botsData");
const shuffle = require("./src/shuffle");

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const playerRecord = {
  wins: 0,
  losses: 0,
};
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public'))
// Add up the total health of all the robots
const calculateTotalHealth = (robots) =>
  robots.reduce((total, { health }) => total + health, 0);

// Add up the total damage of all the attacks of all the robots
const calculateTotalAttack = (robots) =>
  robots
    .map(({ attacks }) =>
      attacks.reduce((total, { damage }) => total + damage, 0)
    )
    .reduce((total, damage) => total + damage, 0);

// console.log("Something is working!");
// Calculate both players' health points after the attacks
const calculateHealthAfterAttack = ({ playerDuo, compDuo }) => {
  const compAttack = calculateTotalAttack(compDuo);
  const playerHealth = calculateTotalHealth(playerDuo);
  const playerAttack = calculateTotalAttack(playerDuo);
  const compHealth = calculateTotalHealth(compDuo);

  return {
    compHealth: compHealth - playerAttack,
    playerHealth: playerHealth - compAttack,
  };
};

app.get("/api/robots", (req, res) => {
  rollbar.info('GET request to /api/robots');
  try {
    res.status(200).send(botsArr);
  } catch (error) {
    rollbar.error(err);
    console.error("ERROR GETTING BOTS", error);
    res.sendStatus(400);
  }
});

app.get("/api/robots/shuffled", (req, res) => {
  rollbar.info('GET request to /api/robots/shuffled');
  try {
    let shuffled = shuffle(bots);
    res.status(200).send(shuffled); 
  } catch (error) {
    rollbar.error(err);
    console.error("ERROR GETTING SHUFFLED BOTS", error);
    res.sendStatus(400);
  }
});

app.post("/api/duel", (req, res) => {
  rollbar.info('POST request to /api/duel');
  try {
    const { compDuo, playerDuo } = req.body;

    const { compHealth, playerHealth } = calculateHealthAfterAttack({
      compDuo,
      playerDuo,
    });

    // comparing the total health to determine a winner
    if (compHealth > playerHealth) {
      playerRecord.losses += 1;
      rollbar.info(`new player ${compDuo, playerDuo}, ${compHealth, playerHealth} calculated successfully`)
      res.status(200).send("You lost!");
    } else {
      playerRecord.losses += 1; // this is a bug
      // playerRecord.wins += 1; // bug fix
      res.status(200).send("You won!");
    }
  } catch (error) {
    rollbar.error(err);
    console.log("ERROR DUELING", error);
    res.sendStatus(400);
  }
});

app.get("/api/player", (req, res) => {
  rollbar.info('GET request to /api/player');
  try {
    res.status(200).send(playerRecord);
  } catch (error) {
    rollbar.error(err);
    console.log("ERROR GETTING PLAYER STATS", error);
    res.sendStatus(400);
  }
});

app.listen(8000, () => {
  console.log(`Listening on 8000`);
});
