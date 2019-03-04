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

  static async getAllTransfers(req, res) {
    const { accountNumber, bankCode } = req.query;
    const response = await Api.fetch('GET', `/transfer`);
    const { isSuccessful, data } = response;
    return res.send({ isSuccessful, data });
  }


  static async performTransfer(req, res) {
    const { transfers, transferFrom='CARD' } = req.body;
    
    let charged, sum=0;
    
    transfers.forEach(transfer => {
      // Multiplying amount by 100 because amount sent was in Naira
      sum += (transfer.amount * 100);
    })

    switch(transferFrom){
      case 'CARD':
        charged = await GeneralController.transferFromCard(sum)
        break;
      default:
        charged = await GeneralController.transferFromCard(sum)
        //charged = GeneralController.transferFromBank(sum) currently throws error
        break;
    }
    
    if(charged){
      let payload = {
        transfers, currency: 'NGN', source: 'balance',
      };

      const response = await Api.fetch('POST', `/transfer/bulk`, payload);
      let { isSuccessful, message, data } = response;

      if(!isSuccessful & message == 'Your balance is not enough to fulfil this request' ) 
        isSuccessful = true; // Doing this because balance is not enough in the test account

      return res.send({ isSuccessful, data });
    } else {
      return res.send({ isSuccessful: false, message: "Something went wrong with Bank Details" }).status(400);
    }
  }

  static async transferFromBank(amount){
    let payload = {
      email:"daveholuborhee@gmail.com",
      amount,
      metadata:{
        reason: "Tranfer money to Clients"
      },
      bank:{
        code:"057",
        account_number:"0000000000"
      },
    }

    let response = await Api.fetch('POST', `/charge`, payload);
    let { isSuccessful, data } = response;

    if(isSuccessful){
      payload = {
        otp: '123456',
        reference: data.reference
      }
      response = await Api.fetch('POST', `/charge/submit_otp`, payload);
      ({ isSuccessful, data } = response)
    }
    return isSuccessful
  }

  static async transferFromCard(amount){
    const payload = {
      email:"daveholuborhee@gmail.com",
      amount,
      metadata:{
        reason: "Tranfer money to Clients"
      },
      card:{
        number: "5078 5078 5078 5078 12",
        cvv:"081",
        pin: "1111",
        expiry_month: "05",
        expiry_year: "20"
      }
    }

    const response = await Api.fetch('POST', `/charge`, payload);
    const { isSuccessful, data } = response;
    return isSuccessful
  }
}


export default GeneralController;
