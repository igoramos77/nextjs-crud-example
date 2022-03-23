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

interface SigInData {
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
   
      setCookie(undefined, '@token', token, {
       maxAge: 60 * 60 * 24 * 7, // 7 days
      });
   
      setUser(user);
   
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
   
      Router.push('/dashboard');
    } catch (error) {
      alert(`Error: ${error}`,)
    }
  }

  const signOut = async () => {
    alert('sair');
    destroyCookie(null, '@token');
    Router.push('/');
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}