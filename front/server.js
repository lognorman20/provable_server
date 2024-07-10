const next = require('next');
const cors = require('cors'); // Add this line

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = 3000;

app.prepare().then(() => {
  const server = require('http').createServer((req, res) => {
    // Add CORS middleware
    cors({
      origin: '*', // Adjust the origin as needed
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    })(req, res, () => {
      handle(req, res);
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${port}`);
  });
});