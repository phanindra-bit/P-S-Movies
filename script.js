const API_KEY = 'a52c88f0'; // Replace with your OMDb API key
const searchInput = document.getElementById('searchInput');
const trendingSection = document.getElementById('trending');
const modal = document.getElementById('modal');
const modalDetails = document.getElementById('modalDetails');
const autocompleteList = document.getElementById('autocompleteList');

// Load trending movies on start
window.onload = () => {
  loadTrending('action'); // default trending
};

// Search on button click
function searchMovies() {
  const query = searchInput.value.trim();
  if (query) fetchMovies(query);
}

// Autocomplete search suggestions
searchInput.addEventListener('input', async () => {
  const query = searchInput.value.trim();
  autocompleteList.innerHTML = '';
  if (query.length < 3) return;

  const data = await fetchData(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
  if (data?.Search) {
    data.Search.slice(0, 5).forEach(movie => {
      const li = document.createElement('li');
      li.textContent = movie.Title;
      li.onclick = () => {
        searchInput.value = movie.Title;
        autocompleteList.innerHTML = '';
        fetchMovies(movie.Title);
      };
      autocompleteList.appendChild(li);
    });
  }
});

// Load trending or filtered movies
async function loadTrending(keyword) {
  const data = await fetchData(`https://www.omdbapi.com/?s=${keyword}&apikey=${API_KEY}`);
  if (data?.Search) displayMovies(data.Search);
}

// Fetch movie search results
async function fetchMovies(query) {
  const data = await fetchData(`https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`);
  if (data?.Search) {
    displayMovies(data.Search);
  } else {
    trendingSection.innerHTML = `<p style="color: white;">No results found for "${query}".</p>`;
  }
}

// Show movie cards
function displayMovies(movies) {
  trendingSection.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" />
      <h3>${movie.Title}</h3>
    `;
    card.onclick = () => showMovieDetails(movie.imdbID);
    trendingSection.appendChild(card);
  });
}

// Fetch movie details by ID
async function showMovieDetails(imdbID) {
  const movie = await fetchData(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
  if (!movie) return;
  modalDetails.innerHTML = `
    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" />
    <h2>${movie.Title}</h2>
    <p><strong>Year:</strong> ${movie.Year}</p>
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Director:</strong> ${movie.Director}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
  `;
  modal.classList.remove('hidden');
}

// Close modal
function closeModal() {
  modal.classList.add('hidden');
}

// Language filter
function filterLanguage(language) {
  fetchMovies(language);
}

// Genre filter
function filterGenre(genre) {
  fetchMovies(genre);
}

// Helper to fetch API data
async function fetchData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.Response === 'True' ? data : null;
  } catch (err) {
    console.error('API error:', err);
    return null;
  }
}
