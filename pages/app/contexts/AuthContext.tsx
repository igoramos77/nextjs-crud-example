import { createContext, useState } from "react";

import Router from "next/router";

import { destroyCookie, parseCookies, setCookie } from 'nookies';

import { User } from '@prisma/client';


import api from "../../../services/api";
import { singInRequest } from "../../../services/auth";

interface IAuthenticatedProps {
  user: User;
  isAuthenticated: boolean;
  signIn(data: SigInData): Promise<void>;
  signOut(): void;
}

export interface SigInData {
  matricula: string;
  password: string;
}

export const AuthContext = createContext({} as IAuthenticatedProps);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  
  const isAuthenticated = !!user;

  const signIn = async ({ matricula, password }: SigInData) => {
    try {
      const { token, user } = await singInRequest({ matricula, password });

      localStorage.setItem('@user', JSON.stringify(user));
   
      setCookie(undefined, '@token', token, {
       maxAge: 60 * 60 * 24 * 7, // 7 days
      });
   
      setUser(user);
   
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
   
      Router.push('/dashboard');
    } catch (error) {
      alert(`Matrícula ou senha inválidos!`,)
    }
  }

  const signOut = async () => {
    destroyCookie(null, '@token', {
      path: '/',
    })
    Router.push('/');
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}