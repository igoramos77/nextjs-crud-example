
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

import jwt from 'jsonwebtoken';

const jwtKey = process.env.JWT_SECRET;
const jwtExpirySeconds = 60 * 60 * 24 * 7; //7 days

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { 
    matricula,
    password,
  } = req.body; 

  const user = await prisma.user.findFirst({
    where: {
      matricula: matricula,
      password: password,
      isActive: true,
    }
  });
  
  if (user) {
    const token = jwt.sign({ matricula,  }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds,
    });
    
    delete user.password;

    return res.status(201).json({
      token: token,
      expires_in: jwtExpirySeconds,
      user: user,
    });
  } else {
    return res.status(404).json({error: 'User not foud.'});
  }
}