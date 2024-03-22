import Notiflix from 'notiflix';

const watchedButtons = document.querySelectorAll('.watched-button');

watchedButtons.forEach(button => {
  button.addEventListener('click', function () {
    const movieId = document.querySelector('.information__id').innerText;
    marcarComoVista(movieId);
  });
});

const addToQueueButtons = document.querySelectorAll('.addToQueue-button');

addToQueueButtons.forEach(button => {
  button.addEventListener('click', function () {
    const movieId = document.querySelector('.information__id').innerText;
    marcarParaVer(movieId);
  });
});

function marcarComoVista(id) {
  let watched = JSON.parse(localStorage.getItem('watched')) || [];

  if (watched.includes(id)) {
    Notiflix.Notify.warning('Esta pelicula ya ha sido guardada como vista.');
    return;
  }
  watched.push(id);
  localStorage.setItem('watched', JSON.stringify(watched));
  Notiflix.Notify.success('Pelicula guardada como vista.');
}

function marcarParaVer(id) {
  let queue = JSON.parse(localStorage.getItem('queue')) || [];

  if (queue.includes(id)) {
    Notiflix.Notify.warning(
      'Esta pelicula ya ha sido guardada para ver mas tarde.'
    );
    return;
  }
  queue.push(id);
  localStorage.setItem('queue', JSON.stringify(queue));
  Notiflix.Notify.success('Pelicula guardada para ver mas tarde.');
}
