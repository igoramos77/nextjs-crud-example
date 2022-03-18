
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const response = await prisma.complementaryActivity.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

    return res.status(201).json(response);
}