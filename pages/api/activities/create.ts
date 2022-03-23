
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

import Joi from 'joi';
import validate from '../../../lib/middlewares/validation';

const schema = Joi.object({
  description: Joi.string().min(5).required(),
  companyName: Joi.string().required(),
  cnpj: Joi.string().pattern(new RegExp('([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})')),
  informedTime: Joi.number().required(),
  certificateUrl: Joi.string().required(),
}); 

export default validate({ body: schema }, async(req: NextApiRequest, res: NextApiResponse) => {
  const { 
    description,
    companyName,
    cnpj,
    informedTime,
    certificateUrl
  } = req.body; 

  const response = await prisma.complementaryActivity.create({
    data: {
      description: description,
      companyName: companyName,
      cnpj: cnpj,
      informedTime: informedTime,
      justification: '',
      certificateUrl: certificateUrl,
    }
  });

  return res.status(201).json(response);
}); 
