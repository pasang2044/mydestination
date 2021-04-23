const axios = require("axios");

if (!process.env.PORT) {
  require("../Secrets");
}
// const { UNSPLAS_API_KEYS } = require("../Secrets");

function getUID() {
  //generate a six digit random numbers
  let uid = "";
  for (let i = 0; i < 6; i++) {
    const rand = Math.floor(Math.random() * 10);
    uid += rand;
  }
  return uid;
}

async function getPhotoFromUnsplash(name) {
  const URL = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=${name}`;

  const res = await axios.get(URL);

  const photos = res.data.results;

  const fallbackPhoto =
    "https://api.unsplash.com/search/photos?client_id=87xr6rR5d8E_U3ha3SmCJC8eWExm3kqn3pEjkZZ-BX8&query=office";
  if (photos.length === 0) return fallbackPhotos;

  const photoLength = photos.length;
  const randIdx = Math.floor(Math.random() * photosLen);

  return res.data.results[0].urls.small;
}
module.exports = {
  getUID,
  getPhoto: getPhotoFromUnsplash,
};
