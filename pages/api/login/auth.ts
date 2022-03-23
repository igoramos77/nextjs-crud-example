
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

interface IJWTDecodeProps {
  matricula: string;
  userId: string;
}

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
    let userId = user.id;

    const token = jwt.sign({ matricula, userId }, jwtKey, {
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