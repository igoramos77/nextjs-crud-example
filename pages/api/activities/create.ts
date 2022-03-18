
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

    await prisma.complementaryActivity.create({
      data: {
        description: description,
        companyName: companyName,
        cnpj: cnpj,
        informedTime: informedTime,
        integralizedTime: 0,
        justification: '',
        certificateUrl: certificateUrl,
        isActive: true,
        status: 'waiting',
      } 
    });

    const lastResult = await prisma.complementaryActivity.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });

    return res.status(201).json(lastResult[0]);
}