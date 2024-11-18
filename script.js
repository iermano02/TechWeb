const apiKey = '181a29bd6ec4295c6e62e96dd6966352';
const baseUrl = 'https://api.themoviedb.org/3';
const movieReviews = {}; // Memorizzazione delle recensioni in memoria (saranno perse quando la pagina viene ricaricata)
let currentMovieId = null; // Variabile per memorizzare l'ID del film selezionato

// Aggiungi l'evento di ricerca quando clicchi sul pulsante
document.getElementById('searchButton').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value;
  if (query) {
    searchMovies(query);
  } else {
    alert('Please enter a movie title to search.');
  }
});

// Funzione per cercare i film
async function searchMovies(query) {
  const url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=en-US&page=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.results.length === 0) {
      document.getElementById('results').innerHTML = '<p>No movies found.</p>';
    } else {
      displayMovies(data.results);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
    document.getElementById('results').innerHTML = '<p>Something went wrong. Please try again later.</p>';
  }
}

// Funzione per visualizzare i film
function displayMovies(movies) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Pulisce i risultati precedenti

  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');
    movieCard.dataset.movieId = movie.id;

    const moviePoster = movie.poster_path
      ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">`
      : `<div style="height: 200px; background: #ddd; border-radius: 8px;">No Image</div>`;

    movieCard.innerHTML = `
      ${moviePoster}
      <h3>${movie.title}</h3>
      <p>Rating: ${movie.vote_average || 'N/A'}</p>
    `;

    movieCard.addEventListener('click', () => showMovieDetails(movie));  // Aggiungi evento click sul film
    resultsContainer.appendChild(movieCard);
  });
}

// Funzione per mostrare i dettagli del film
function showMovieDetails(movie) {
  currentMovieId = movie.id;

  document.getElementById('movieTitle').innerText = movie.title;
  document.getElementById('movieOverview').innerText = movie.overview.substring(0, 300); 
  document.getElementById('moviePoster').src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  
  const overviewText = movie.overview;
  const overviewContainer = document.getElementById('movieOverview');
  if (overviewText.length > 300) {
    const readMoreButton = document.createElement('button');
    readMoreButton.textContent = 'Read more';
    readMoreButton.classList.add('read-more-btn');
    readMoreButton.addEventListener('click', () => {
      overviewContainer.innerText = overviewText;
      readMoreButton.style.display = 'none'; 
    });
    overviewContainer.appendChild(readMoreButton);
  }
  
  document.getElementById('movieDetails').style.display = 'block';
  document.getElementById('reviewText').value = '';
  document.getElementById('reviewsSection').innerHTML = '';
  loadReviews(movie.id);
}

// Funzione per inviare la recensione
document.getElementById('submitReview').addEventListener('click', () => {
  const reviewText = document.getElementById('reviewText').value;
  if (reviewText && currentMovieId) {
    addReview(currentMovieId, reviewText);
  }
});

// Funzione per aggiungere una recensione
function addReview(movieId, reviewText) {
  if (!movieReviews[movieId]) {
    movieReviews[movieId] = [];
  }

  const review = {
    id: movieReviews[movieId].length + 1,
    text: reviewText,
    likes: 0
  };

  movieReviews[movieId].push(review);
  loadReviews(movieId);
}

// Funzione per caricare le recensioni
function loadReviews(movieId) {
  const reviewsContainer = document.getElementById('reviewsSection');
  reviewsContainer.innerHTML = '';

  const reviews = movieReviews[movieId] || [];
  reviews.forEach(review => {
    const reviewElement = document.createElement('div');
    reviewElement.classList.add('review');
    reviewElement.innerHTML = `
      <p>${review.text}</p>
      <button class="like-button" data-review-id="${review.id}" onclick="likeReview(${movieId}, ${review.id})">Like (${review.likes})</button>
    `;
    reviewsContainer.appendChild(reviewElement);
  });
}

// Funzione per mettere "like" a una recensione
function likeReview(movieId, reviewId) {
  const review = movieReviews[movieId].find(r => r.id === reviewId);
  if (review) {
    review.likes++;
    loadReviews(movieId); 
  }
}
