const axios = require('axios');

const apiKey = 'a8bccd912c7f4cca81254588ad081783';
const url = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${apiKey}`;

axios.get(url)
  .then(response => {
    if (response.data.status === 'ok') {
      console.log('✅ API Key is valid. You got the news!');
    } else {
      console.log('❌ Invalid API Key:', response.data.message);
    }
  })
  .catch(error => {
    console.error('❌ Error making the request:', error.message);
  });
