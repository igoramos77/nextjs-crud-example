
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
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
}