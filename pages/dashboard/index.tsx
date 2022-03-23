import { GetServerSideProps } from 'next';
import Router from "next/router";
import { useForm } from 'react-hook-form';
import { destroyCookie, parseCookies } from 'nookies';
import jwt_decode from "jwt-decode";

interface IJWTDecodeProps {
  matricula: string;
  userId: string;
}

import api from '../../services/api';

import Image from 'next/image';
import { ComplementaryActivity, EStatus, User } from '@prisma/client';
import { FormEvent, useCallback, useState } from 'react';

import { prisma } from '../../lib/prisma';

export default function App({ atividadesComplementares }) {
  const { register, handleSubmit } = useForm();
  
  const [allAtividadesComplementares, setAllAtividadesComplementares] = useState<ComplementaryActivity[]>(atividadesComplementares);

  const handleSubmitForm = useCallback(async (data) => {
    console.log(data);

    if (data.description === "" || data.companyName === "" || data.cnpj === "" || data.informedTime === "" || data.certificateUrl === "") {
      console.log('campos vazios');
    }

    try {      
      const response = await api.post(`/api/activities/create`, {
        description: data.description, 
        companyName: data.companyName,
        cnpj: data.cnpj,
        informedTime: Number(data.informedTime),
        certificateUrl: data.certificateUrl,
      });
  
      console.log(response.data);

      setAllAtividadesComplementares([
        ...allAtividadesComplementares,
        response.data,
      ]);

    } catch (error) {
      console.log(error);    
    }
    
  }, [allAtividadesComplementares]);

  const signOut = () => {
    destroyCookie(null, '@token');
    localStorage.removeItem('@user');
    Router.push('/');
  }

  return (
    <>
      <h2>Create a new actives</h2>
      <form onSubmit={handleSubmit(handleSubmitForm)}>
        <label>Descrição do certificado</label><br />
        <input {... register('description')} type="text" name="description" /> <br/><br/>

        <label>Nome da Empresa</label><br />
        <input {... register('companyName')} type="text" name="companyName" /> <br/><br/>

        <label>CNPJ da Empresa</label><br />
        <input {... register('cnpj')} type="text" name="cnpj" /> <br/><br/>

        <label>Certificado Url</label><br />
        <input {... register('certificateUrl')} type="text" name="certificateUrl" /> <br/><br/>

        <label>Carga horária informada</label><br />
        <input {... register('informedTime')} type="number" name="informedTime" /> <br/><br/>

        <button type="submit">Create activitie!</button>
      </form>

      <br/><br/>
      <h2>Lista de atividades:</h2>

      <ul>
        {allAtividadesComplementares?.map((activity) => (
          <li key={activity.id}>{activity.description + ' / ' + activity.companyName}</li>
        ))}
      </ul>
      <br/><br/>
      <button onClick={() => signOut()}>Logout!</button>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  //console.log(ctx.req.cookies);
  const { ['@token']: token } = parseCookies(ctx);
  const { userId } = jwt_decode<IJWTDecodeProps>(token);

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const complementaryActivity = await prisma.complementaryActivity.findMany({
    where: {
      userId: userId,
      NOT: {
        status: 'recused'
      }
    },
  });

  /* 
  const complementaryActivity = await prisma.$queryRaw`select * from "public"."ComplementaryActivity"`;
  console.log(complementaryActivity) 
  */

  return {
    props: {
      atividadesComplementares: complementaryActivity,
    }
  }
}