console.log("TMDB Movie Explorer Loaded ");

const TMDB_TOKEN = "PASTE_YOUR_TMDB_READ_TOKEN_HERE";

let currentPage = 1;
let currentSearch = "Avengers";

const moviesDiv = document.getElementById("movies");
const searchInput = document.getElementById("searchInput");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");

async function getMovies(query, page) {
    loading.style.display = "block";
    moviesDiv.innerHTML = "";
    errorDiv.textContent = "";

    let url;

    if (query.trim() === "") {
        url = `https://api.themoviedb.org/3/trending/movie/week?page=${page}`;
    } else {
        url = `https://api.themoviedb.org/3/search/movie?query=${query}&page=${page}`;
    }

    try {
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${TMDB_TOKEN}` }
        });

        const data = await res.json();
        loading.style.display = "none";

        if (!data.results.length) {
            errorDiv.textContent = "❌ No movies found";
            return;
        }

        displayMovies(data.results);
        pageInfo.textContent = `Page ${page}`;

    } catch (err) {
        errorDiv.textContent = "⚠️ Error fetching movies";
        console.error(err);
    }
}

function displayMovies(movies) {
    moviesDiv.innerHTML = movies
        .map(m => `
        <div class="movie">
            <img src="https://image.tmdb.org/t/p/w300${m.poster_path}" onerror="this.src='https://via.placeholder.com/300'">
            <h4>${m.title}</h4>
            <p>⭐ ${m.vote_average.toFixed(1)} | 📅 ${m.release_date || "N/A"}</p>
        </div>
    `)
        .join("");
}

let timer;
searchInput.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        currentSearch = searchInput.value;
        currentPage = 1;
        getMovies(currentSearch, currentPage);
    }, 600);
});


let block = false;
function paginate(step) {
    if (block) return;
    block = true;
    currentPage += step;
    getMovies(currentSearch, currentPage);
    setTimeout(() => (block = false), 800);
}

prevBtn.addEventListener("click", () => currentPage > 1 && paginate(-1));
nextBtn.addEventListener("click", () => paginate(1));


getMovies(currentSearch, currentPage);
