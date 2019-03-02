import Api from '../Api';

class SupplierController {
  static async create(req, res) {
    const {
      name, description, account_number, bank_code, // eslint-disable-line camelcase
    } = req.body;

    const payload = {
      name, description, account_number, bank_code, currency: 'NGN', type: 'nuban',
    };


    const response = await Api.fetch('POST', '/transferrecipient', payload);
    const { isSuccessful, message, data } = response;
    return res.send({ isSuccessful, message, data });
  }


  static async list(req, res) {
    const { perPage, page } = req.query;
    const response = await Api.fetch('GET', `/transferrecipient?perPage=${perPage}&page=${page}`);
    const { isSuccessful, message, data } = response;
    return res.send({ isSuccessful, message, data });
  }
}


export default SupplierController;
