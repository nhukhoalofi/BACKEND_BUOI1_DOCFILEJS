import express from 'express';
import mongoose from 'mongoose';

// Connect
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
},{
  versionKey: false
}
);

// Model
const Movie = mongoose.model('Movie', movieSchema);

const app = express();
app.use(express.json());

// lấy hết phim
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find(); 
    res.status(200).json(movies); 
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});
// tạo mới
app.post('/movies', async (req, res) => {
  const { title, genre, rating } = req.body;

  if (!title || !genre || rating === undefined) {
    return res.status(400).send('Thieu thong tin');
  }
  try {
    const newMovie = new Movie({ title, genre, rating });
    const savedMovie = await newMovie.save();
    const allMovies = await Movie.find();

    res.status(201).json({
      message: 'Success',
      movies: allMovies
    });
  } catch (err) {

    res.status(400).send('Error!'); 
  }
});
app.get('/movies/count', async (req, res) => {
  try {
    const count = await Movie.countDocuments(); 
    res.status(200).json({ count }); 
  } catch (err) {
    res.status(400).send('Error');
  }
});
// Lấy phim ID
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const movie = await Movie.findById(id);
    if (!movie) {
      return res.status(404).send('Movie not found');
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(400).send('Error');
  }
});

// Update phim
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

// Xóa phim
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
// tim theo loại
app.get('/movies/genre/:genre', async (req, res) => {
  const { genre } = req.params;  
  if (!genre) {
    return res.status(400).send('Genre is required');
  }

  try {
    const movies = await Movie.find({ genre: genre });
    if (movies.length === 0) {
      return res.status(404).send('No movies found for this genre');
    }

    res.status(200).json(movies);
  } catch (err) {
    res.status(400).send('Error');
  }
});
// lay phim rating cao nhat
app.get('/movies-highest-rated', async (req, res) => {
  try {
    const highestRatedMovie = await Movie.findOne().sort({ rating: -1 });

    if (highestRatedMovie=== undefined) {
      return res.status(404).send('No movies found');
    }
    res.status(200).json(highestRatedMovie);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
