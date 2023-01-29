import './sass/main.scss';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { requestToServer } from './js/apiService';
import { renderHtml } from './js/render-gallery';
import { refs } from './js/refs';

let page = 1;
let inputValue = '';
let totalHits = 0;
let isLoading = false;

const lightbox = new SimpleLightbox('.gallery a', {
captions: true,
captionsData: 'alt',
captionDelay: 250,
});

refs.form.addEventListener('submit', onClickSearch);

async function onClickSearch(e) {
e.preventDefault();
const { elements: { searchQuery } } = e.currentTarget;
inputValue = searchQuery.value.trim();

if (inputValue === '' || inputValue[0] === ' ') {
Notiflix.Notify.failure("Please enter a valid search query.");
return;
}

const photo = await searchPhoto(inputValue);
totalHits = photo.totalHits;

if (photo.hits.length === 0) {
Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
} else {
Notiflix.Notify.success("Hooray! We found ${photo.totalHits} images.");
}

refs.gallery.innerHTML = '';
renderHtml(photo.hits);
page = 1;
refs.form.reset();
lightbox.refresh();
}

async function searchPhoto(value) {
try {
const res = await requestToServer(value);
return res.data;
} catch (error) {
console.error(error);
Notiflix.Notify.failure('An error occurred while trying to fetch data');
}
}

async function loadMore() {
if (refs.gallery.children.length >= totalHits) {
return Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

if (isLoading) return;

isLoading = true;
page += 1;
try {
const photo = await requestToServer(inputValue, page);
renderHtml(photo.data.hits);
} catch (error) {
Notiflix.Notify.failure("An error has occurred while trying to load more images. Please try again later.");
console.error(error);
}
isLoading = false;
lightbox.refresh();
}

window.addEventListener('scroll', () => {
let contentHeight = document.body.offsetHeight;
let yOffset = window.pageYOffset;
let windowHeight = window.innerHeight;
let y= yOffset + windowHeight;

if (y >= contentHeight) {
loadMore();
}
});