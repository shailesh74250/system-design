// Import Express
const express = require('express');
const { Client } = require('@elastic/elasticsearch');

// Initialize the app
const app = express();

// Define the port
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Elasticsearch client
const esClient = new Client({ node: 'http://localhost:9200', sniffOnStart: true }); // Use your Elastic endpoint

// Sample data endpoint to load documents
app.post('/api/data', async (req, res) => {
  const { data } = req.body; // Expecting an array of documents
  console.log('data', data);
  try {
    const bulkBody = data.flatMap((doc) => [{ index: { _index: 'courses' } }, doc]);
    console.log('bulkBody', bulkBody);
    await esClient.bulk({ refresh: true, body: bulkBody });

    res.status(200).send({ message: 'Data indexed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error indexing data' });
  }
});

// Full-text search endpoint
app.get('/api/search', async (req, res) => {
  const { query } = req.query;

  try {
    const result = await esClient.search({
      index: 'courses',
      body: {
        query: {
          match: { title: query }
        }
      }
    });

    res.status(200).send(result.body.hits.hits.map((hit) => hit._source));
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Error performing search' });
  }
});

// A simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});