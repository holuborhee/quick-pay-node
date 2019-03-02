import Api from '../Api';

class GeneralController {
  static async getAllBanks(req, res) {
    const response = await Api.fetch('GET', '/bank');
    const { isSuccessful, data } = response;
    return res.send({ isSuccessful, data });
  }

  static async resolveAccountNumber(req, res) {
    const { accountNumber, bankCode } = req.query;
    const response = await Api.fetch('GET', `/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`);
    const { isSuccessful, data } = response;
    return res.send({ isSuccessful, data });
  }
}


export default GeneralController;
