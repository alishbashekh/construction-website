import jwt from 'jsonwebtoken';
import ErrorHandler from '../utils/Error.js';
import otpGenerator from 'otp-generator';
import sendMail , {EmailEnums, EmailTemplates} from '../utils/sendMail.js';
import mongoose from 'mongoose';
import logger from '../logger.js';

class BaseController {
    /*create token */
    generateToken(id, accountType, duration = '365d'){
      if(!id){
        throw new ErrorHandler('id not found', 400);
      }
      return jwt.sign(
        {id , accountType},
        process.env.JWT_SECRET_KEY, //ask about it later
        {expiresIn: duration}
      );
    }

    isValidId(id){
        return mongoose.Types.ObjectId.isValid(id);
    }

    handleError(next, message, statusCode = 500){
        const error = new ErrorHandler(message, statusCode);
        next(error);  //ask about it later
    }

    validateRequiredFields(reqBody, requiredFields, reqFiles = [], requiredFileFields = []){ // ask about it later 
      const missingFields = requiredFields.filter(field => !reqBody[field]);

      //check for missing fields
      if (missingFields.length >0){
        return {
            success: false,
            message: `this fleid is required ${missingFields.join(',')}`
        };
      }
       const missingFiles = requiredFileFields.filter(requiredField => {
      return !reqFiles.some(file => file.fieldname === requiredField);
    });
    if (missingFiles.length >0){
        return {
            success: false,
            message: `this file is required ${missingFiles.join(',')}`
        };
      }
      return null;
    }

    generateOtp(limit) {
        //making random numbers for otp
       return otpGenerator.generate(limit,{
         digits: true,
         lowerCaseAlphabets: false,
         upperCaseAlphabets: false,
         specialChars: false
       }); 
    }

    verifyToken(token){
        if(!token){
            throw new ErrorHandler('token is not found', 401);
        }
        //verify token 
        try{
         return jwt.verify(token, process.env.JWT_SECRET_KEY);
        }catch(error){
          if (error.name === 'TokenExpiredError'){
            throw new ErrorHandler('Token has been expired',401);
          }
          throw new ErrorHandler('wrong or unauthenticate token', 401);
        }
    }
    decodeToken(token){
        if (!token){
            throw new ErrorHandler('token required', 400);
        }
        return jwt.decode(token);
    }

    async sendOtpMail(email, otp, subject){
        if (!email || !otp || !subject) {
      throw new ErrorHandler('Email, OTP aur Subject sab chahiye', 400);
    }
      //email sending 
      await sendMail({
        template: EmailTemplates.otp, 
        subject,
        otp,
        email,
        type: EmailEnums.otp
      });
      logger.info (`otp sent : ${email}`);
      return true;
    }

     async universalMail(email, data, subject, type) { //ask about it later
    if (!email || !subject || !type || !EmailTemplates[type] || !EmailEnums[type]) {
      throw new ErrorHandler('Email parameters galat hain', 400);
    }
    await sendMail({
      template: EmailTemplates[type], 
      subject,                        
      data,                           
      email,                          
      type: EmailEnums[type]          
    });

    logger.info(`${type} email bheja: ${email}`);
    return true;
  }

}
export default BaseController;