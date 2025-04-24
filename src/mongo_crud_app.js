import express from 'express';
import mongoose from 'mongoose';

// MongoDB connection
mongoose.connect('mongodb://user:password@127.0.0.1:27019/S-Mongo?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Schema
const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  rating: Number,
  release_year: Number
});
// Model
const Movie = mongoose.model('Movie', movieSchema);

const app = express();
app.use(express.json());

// Create a new movie
app.post('/movies', async (req, res) => {
  const { title, genre, rating } = req.body;
  try {
    const movie = new Movie({ title, genre, rating });
    const result = await movie.save();
    res.status(201).send(result);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Read all movies
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find(); // ✅ lấy danh sách
    res.status(200).send(movies);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Update a movie
app.put('/movies/:id', async (req, res) => {
  const { title, genre, rating } = req.body;
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { title, genre, rating },
      { new: true }
    );
    if (!movie) return res.status(404).send('Movie not found');
    res.send(movie);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Delete a movie
app.delete('/movies/:id', async (req, res) => {
  try {
    const result = await Movie.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send('Movie not found');
    res.send(result);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
