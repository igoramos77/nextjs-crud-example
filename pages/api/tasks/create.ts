
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
    const { id, title, isDone, createdAt, updatedAt } = req.body; 

    await prisma.task.create({
      data: {
        title,
        isDone: false,
      } 
    });

    return res.status(201).json({});
}