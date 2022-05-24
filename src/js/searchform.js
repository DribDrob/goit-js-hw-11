import PixabayApiService from './fetchphotos';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const searchEl = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const infiniteScroll = document.querySelector('#infinite-scroll');

let lightbox = new SimpleLightbox('.gallery a');
const pixabayApiService = new PixabayApiService();

searchEl.addEventListener('submit', onSearchSubmit)

function onSearchSubmit (event) {
    event.preventDefault();
    pixabayApiService.query = event.currentTarget.elements.searchQuery.value.trim();

    clearGallery();
    pixabayApiService.resetPage();
    if (pixabayApiService.query !== ''){
        pixabayApiService.fetchPhotos()
        .then(images => {
            if (images.totalHits === 0){
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return;
              }            
            Notify.success(`Hooray! We found ${images.totalHits} images.`);
            makeGalleryMarkup(images);
            pixabayApiService.incrementPage();
    })
        .catch((error) => {console.log(error);})
        
}
}

function clearGallery(){
gallery.innerHTML = '';
}

function makeGalleryMarkup(images){
    images.hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads})=>
    gallery.insertAdjacentHTML('beforeend', 
`<div class="gallery-card"><a class="gallery-item" href="${largeImageURL}"><img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`))
lightbox.refresh();
}
const onEntry = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && pixabayApiService.query !== '') {

        pixabayApiService.fetchPhotos().then(images => {
            if (images.hits.length === 0){
                Notify.warning("We're sorry, but you've reached the end of search results.");
            }
            makeGalleryMarkup(images);
            pixabayApiService.incrementPage();
        });
      }
    });
  };
  
  const observer = new IntersectionObserver(onEntry, {
    rootMargin: '150px',
  });
  observer.observe(infiniteScroll);