export default {
  namespace: "movie",
  state: {
    title: "",
    posterUrl: ""
  },
  reducers: {
    title(state, { title }) {
      return title;
    },
    posterUrl(state, { posterUrl }) {
      return posterUrl;
    }
  },
  effects: {
    takeLatest: function* fetchMovieLatest({ id }, { put, call, select }) {
      try {
        const response = yield call(getMovie, id);
        if (response) {
          yield put({
            type: "movie/title",
            title: response.Title
          });
          yield put({
            type: "movie/posterUrl",
            posterUrl: response.Poster
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    *fetchMovie({ id }, { put, call, select }) {
      try {
        const response = yield call(getMovie, id);
        if (response) {
          yield put({
            type: "movie/title",
            title: response.Title
          });
          yield put({
            type: "movie/posterUrl",
            posterUrl: response.Poster
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
  subscriptions: {}
};

const moviesApi = new OmdbApi("http://www.omdbapi.com/", "dc390a36");

const getMovie = id => {
  return moviesApi.retrieveMovieById(id);
};

class OmdbApi {
  constructor(url, key) {
    this.url = url;
    this.key = key;
  }

  retrieveMovieById(id) {
    const fetchUrl = `${this.url}?apikey=${this.key}&i=${id}`;
    const response = fetch(fetchUrl)
      .then(response => {
        if (response.status !== 200) {
          return;
        }
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(error => error);

    return response;
  }
}
