
import bodyParser from 'body-parser';
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.static('images'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("Node js backed running!");
  });


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });