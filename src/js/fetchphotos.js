import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api';
const API_KEY = '27565635-1fa3e47e8e30944c800be594a';



export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

async fetchPhotos() {
  const params = new URLSearchParams({
    key: API_KEY,
    q: this.searchQuery,
    image_type: 'photo',
    orientation: "horizontal",
    safesearch: true,
    page: this.page,
    per_page: 40,
  });
  const {data} = await axios(`/?${params}`)
          return data;
      };

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
