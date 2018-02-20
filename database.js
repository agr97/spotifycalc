const { Pool, Client } = require('pg')

// pools will use environment variables
// for connection information
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'spotify',
    password: 'gora',
    port: 5432,
  })

  /**
const values = ['37i9dQZdfgEVXbMDoHDwVN2tF', 'spotifycharts', false, 50, 0, 50];
pool.query('INSERT INTO playlists VALUES($1, $2, $3, $4, $5, $6);', values, (err, res) => {
  console.log(err, res)
  pool.end()
});

 */

pool.query('SELECT * FROM playlists', (err, res) => {
    console.log(err, res)
})

setTimeout(() => pool.end(), 10000);
