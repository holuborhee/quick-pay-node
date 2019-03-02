import axios from 'axios';

const API_URL = 'https://api.paystack.co';

class Api {
  static async fetch(method = 'GET', url = '/', payload = {}) {
    let response;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        },
      };

      switch (method) {
        case 'POST':
          response = await axios.post(API_URL + url, payload, config);
          break;
        default:
          response = await axios.get(API_URL + url, config);
          break;
      }
    } catch (error) {
      ({ response } = error);
      console.log(response)
      console.log(`Error fecthing ${url} - ${error}`);
    }

    const code = response.status;
    const { status: isSuccessful, message, data } = response.data;

    return {
      code, isSuccessful, message, data,
    };
  }
}

export default Api;
