import axios from 'axios';
import { modales } from './modal_pelicula';
import { llenarmodal } from './llenar_modal';
import { hacerPaginacion } from './paginacion';

const API_KEY = ' 92a29a208697474804603c1dc44ad181';

const BASE_URL = 'https://api.themoviedb.org/3';

let allMovies = [];
let allGenres = [];

export async function obtenerPeliculasPopulares() {
  try {
    for (let page = 1; page <= 250; page++) {
      const respuesta = await axios.get(`${BASE_URL}/movie/popular`, {
        params: {
          api_key: API_KEY,
          language: 'es-ES',
          page: page,
        },
      });
      allMovies.push(...respuesta.data.results);
    }

    const dataGenres = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: {
        api_key: API_KEY,
        language: 'es-ES',
      },
    });

    allGenres.push(...dataGenres.data.genres);
    localStorage.setItem('peliculas', JSON.stringify(allMovies));
    localStorage.setItem('generos', JSON.stringify(allGenres));
    hacerPaginacion(allMovies);
  } catch (error) {
    console.error(
      'Error al obtener las películas populares. Por favor, inténtalo de nuevo más tarde.'
    );
  }
}

export function displayMovies(movies) {
  const galleryDiv = document.querySelector('.gallery');
  galleryDiv.innerHTML = '';
  movies.forEach(movie => {
    const movieDiv = document.createElement('li');
    movieDiv.setAttribute('data-modal-open', '');
    movieDiv.classList.add('gallery__item');
    movieDiv.setAttribute('id', `${movie.id}`);

    const image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/w400${movie.poster_path}`;
    image.alt = movie.title;

    const paragraph = document.createElement('h3');
    paragraph.classList.add('movie-tittle');
    paragraph.textContent = `${movie.title}`;

    const paragraph2 = document.createElement('p');
    paragraph2.classList.add('movie-gender');

    for (const id in allGenres) {
      for (let i = 0; i < movie.genre_ids.length; i++) {
        if (allGenres[id].id == movie.genre_ids[i]) {
          paragraph2.append(`${allGenres[id].name} `);
        }
      }
    }

    paragraph2.append(`| (${movie.release_date.substring(0, 4)})`);

    movieDiv.appendChild(image);
    movieDiv.appendChild(paragraph);
    movieDiv.appendChild(paragraph2);
    galleryDiv.appendChild(movieDiv);
  });

  modales();
  llenarmodal(movies, allGenres);
}

const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector("input[name='searchQuery']");

searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  const keyword = searchInput.value.trim();

  if (keyword) {
    allMovies = [];

    await obtenerPeliculasRelacionadas(keyword);
  }
});

async function obtenerPeliculasRelacionadas(keyword) {
  try {
    for (let page = 1; page <= 10; page++) {
      const respuesta = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          language: 'es-ES',
          query: keyword,
          page: page,
        },
      });
      allMovies.push(...respuesta.data.results);
    }

    const datos = [...allMovies];
    if (datos.length === 0) {
      throw new Error('erferv');
    }
    hacerPaginacion(datos);
  } catch (error) {
    console.error(
      'Error al obtener las películas relacionadas con la palabra clave. Por favor, inténtalo de nuevo más tarde.'
    );
    if (error instanceof Error) {
      const errorDiv = document.getElementById('searchResults');
      errorDiv.classList.add('txtError');
      const errorTxt = document.createElement('p');
      errorTxt.textContent =
        'Search result not successful. Enter the correct movie name.';

      errorDiv.appendChild(errorTxt);
    }
  }
}

obtenerPeliculasPopulares();
