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
  rating: Number
});

// Model
const Movie = mongoose.model('Movie', movieSchema);

const app = express();
app.use(express.json());



// Lấy phim
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find(); 
    res.status(200).json(movies); 
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});
// Create (POST)
app.post('/movies', async (req, res) => {
  const { title, genre, rating } = req.body;
  try {
    const newMovie = new Movie({ title, genre, rating });
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});
// Update (PUT)
app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, genre, rating } = req.body;
  try {
    const updated = await Movie.findByIdAndUpdate(id, { title, genre, rating }, { new: true });
    if (!updated) {
      res.status(404).send('Movie not found');
    } else {
      res.status(200).json(updated);
    }
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Delete (DELETE)
app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Movie.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).send('Movie not found');
    } else {
      res.status(200).send('Movie deleted');
    }
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
