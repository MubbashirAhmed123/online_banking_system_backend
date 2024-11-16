const crypto = require('crypto')
const bcrypt=require('bcryptjs');
const generateAccountNumber = () => {
   
    const randomNumber = crypto.randomInt(10**7,10**8-1)
    const accountNumber = `IB${randomNumber}`
    return accountNumber
}

const generateSecurityPin=()=>{
    const pin = crypto.randomInt(100000,999999)
    // const hashPin=await bcrypt.hash(pin,10)

    return pin
}

const isMatch=async(pin,hash)=>{
   return await bcrypt.compare(pin,hash)

}

module.exports={generateAccountNumber,generateSecurityPin,isMatch}
