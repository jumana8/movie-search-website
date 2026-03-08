console.log("JS is running");
const movieInput = document.getElementById('movieName');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const messageDiv = document.getElementById('message');
const movieInfo = document.getElementById('movieInfo');
searchBtn.addEventListener('click', searchMovie);
clearBtn.addEventListener('click', clearInfo);
movieInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        searchMovie();
    }
});
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${ type }`;  
    messageDiv.classList.remove('hidden');
}
function clearInfo() {
    movieInfo.classList.add('hidden');
    movieInput.value = '';
    showMessage('Information cleared', 'success');
}
async function searchMovie() {
    const movie = movieInput.value.trim();

    if (!movie) {
        showMessage('Please enter a movie title', 'error');
        movieInfo.classList.add('hidden');
        return;
    }
    try {
        showMessage('Searching...', 'info');
        const apiKey = '001f4e26f89d87fdb6192c75ad9f2b94';
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movie)}`; 
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('API error');
        }
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            showMessage('Movie not found', 'error');
            movieInfo.classList.add('hidden');
            return;
        }
        displayMovieInfo(data.results[0]);
        showMessage('Movie found!', 'success');

    } catch (error) {
        showMessage('Error fetching movie data', 'error');
        movieInfo.classList.add('hidden');
        console.error(error);
    }
}

function displayMovieInfo(movie) {
    document.getElementById('infoTitle').textContent = movie.title || 'No title';
    document.getElementById('infoOverview').textContent = movie.overview || 'No overview available';
    document.getElementById('infoReleaseDate').textContent = movie.release_date || 'N/A';
    document.getElementById('infoRating').textContent = movie.vote_average ?? 'N/A';
    document.getElementById('infoLanguage').textContent =
        movie.original_language ? movie.original_language.toUpperCase() : 'N/A';

    document.getElementById('infoVotes').textContent =
        movie.vote_count ?? 'N/A';

    const poster = document.getElementById('infoPoster');

    if (movie.poster_path) {
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.style.display = 'block';
    } else {
        poster.style.display = 'none';
    }

    movieInfo.classList.remove('hidden');
}