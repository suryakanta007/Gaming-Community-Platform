const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const app = express();
const port = 5010;

app.use(cors());
app.use(express.json());

let db;
(async () => {
  db = await open({
    filename: path.join(__dirname, 'database.sqlite'),
    driver: sqlite3.Database,
  });
})();

app.get('/', (req, res) => {
  res.send('Welcomet to Gaming Community.');
});

async function getAllGames() {
  let query = 'SELECT * FROM games';
  let response = await db.all(query, []);
  return { games: response };
}

app.get('/games', async (req, res) => {
  try {
    let results = await getAllGames();
    if (results.games.length === 0) {
      return res.status(404).json({ message: 'Any games are not found!' });
    }

    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

async function getGameDetails(id) {
  let query = 'SELECT * FROM games WHERE id = ?';
  let response = await db.all(query, [id]);
  return { game: response[0] };
}

app.get('/games/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  try {
    let results = await getGameDetails(id);
    if (results.game === undefined) {
      return res.status(404).json({ message: `The game is not find!` });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

async function getGamesByGenre(genre) {
  let query = 'SELECT * FROM games WHERE genre = ?';
  let response = await db.all(query, [genre]);
  return { games: response };
}

app.get('/games/genre/:genre', async (req, res) => {
  let genre = req.params.genre;
  try {
    let results = await getGamesByGenre(genre);
    if (results.games.length == 0) {
      return res.status(404).json({ message: `No game found on ${genre}!` });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

async function getGamesByPlatform(platform) {
  let query = 'SELECT * FROM games WHERE platform = ?';
  let response = await db.all(query, [platform]);
  return { games: response };
}

app.get('/games/platform/:platform', async (req, res) => {
  let platform = req.params.platform;
  try {
    let results = await getGamesByPlatform(platform);
    console.log(results);
    if (results.games.length === 0) {
      return res
        .status(404)
        .json({ message: `No games are avalibale for ${platform} .` });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

async function sortGamesByRating() {
  let query = 'SELECT * FROM games ORDER BY rating DESC ';
  let response = await db.all(query, []);
  return { games: response };
}

app.get('/games/sort-by-rating', async (req, res) => {
  try {
    let results = await sortGamesByRating();
    if (results.games.length === 0) {
      return res.status(404).json({ message: 'No games are avalibale!' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

async function getAllPlayers() {
  let query = 'SELECT * FROM players';
  let response = await db.all(query, []);
  return { players: response };
}

app.get('/players', async (req, res) => {
  try {
    let results = await getAllPlayers();

    if (results.players.length === 0) {
      return res.status(404).json('Players are not avalible!');
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

async function getPlayerDetails(id) {
  let query = 'SELECT * FROM players WHERE id = ?';
  let response = await db.all(query, [id]);
  return { player: response[0] };
}

app.get('/players/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await getPlayerDetails(id);
    if (results.player === undefined) {
      return res.status(404).json({ message: 'the player not find!' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

async function getPlayersByPlatform(platform) {
  let query = 'SELECT * FROM players WHERE platform = ?';
  let response = await db.all(query, [platform]);
  return { players: response };
}

app.get('/players/platform/:platform', async (req, res) => {
  let platform = req.params.platform;
  try {
    let results = await getPlayersByPlatform(platform);
    if (results.players.length === 0) {
      return res
        .status(404)
        .json({ message: 'This platform plyer is not avalibale.' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortPlayersOnRating() {
  let query = 'SELECT * FROM players ORDER BY rating DESC';
  let response = await db.all(query, []);
  return { players: response };
}

app.get('/players/sort-by-rating', async (req, res) => {
  try {
    let results = await sortPlayersOnRating();
    if (results.players.length === 0) {
      return res.status(404).json({ message: 'PLayers not found!' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getAllTournaments() {
  let query = 'SELECT * FROM tournaments';
  let response = await db.all(query, []);
  return { tournaments: response };
}

app.get('/tournaments', async (req, res) => {
  try {
    let results = await getAllTournaments();
    if (results.tournaments.length === 0) {
      return res.status(404).json({ message: 'No players avalibale.' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getTournamentDetails(id) {
  let query = 'SELECT * FROM tournaments WHERE id = ?';
  let response = await db.all(query, [id]);
  return { tournament: response[0] };
}

app.get('/tournaments/details/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await getTournamentDetails(id);
    if (results.tournament === undefined) {
      return res.status(404).json({ message: 'the tournament not find!' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function getTournamentByGAmeId(id) {
  let query = 'SELECT * FROM tournaments WHERE gameId = ?';
  let response = await db.all(query, [id]);
  return { tournaments: response };
}

app.get('/tournaments/game/:id', async (req, res) => {
  let id = req.params.id;
  try {
    let results = await getTournamentByGAmeId(id);
    if (results.tournaments.length === 0) {
      return res.status(404).json({ mesaage: 'Tournaments are not found! ' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

async function sortTournaments() {
  let query = 'SELECT * FROM tournaments ORDER BY prizePool DESC ';
  let response = await db.all(query, []);
  return { tournaments: response };
}

app.get('/tournaments/sort-by-prize-pool', async (req, res) => {
  try {
    let results = await sortTournaments();
    if (results.tournaments.length === 0) {
      return res.status(404).json({ mesaage: 'Tournaments are not found! ' });
    }
    res.status(200).json(results);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
