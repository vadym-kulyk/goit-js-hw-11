import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api';
const MY_KEY = 'key=7775247-4cc027e0f3d43ce0e28a0b318';

export async function requestToServer(value, page) {
  return await axios(
    `?${MY_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`,
  );
}