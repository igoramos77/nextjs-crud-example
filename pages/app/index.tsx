import { GetServerSideProps } from 'next';
import { signOut, useSession } from 'next-auth/react';

import { useForm } from 'react-hook-form';

import api from '../../src/services/api';

import Image from 'next/image';
import { ComplementaryActivity, EStatus } from '@prisma/client';
import { FormEvent, useCallback, useState } from 'react';

import { prisma } from '../../lib/prisma';

export default function App({ atividadesComplementares }) {
  const { register, handleSubmit } = useForm();
  const { data, status } = useSession();
  
  const [allAtividadesComplementares, setAllAtividadesComplementares] = useState<ComplementaryActivity[]>(atividadesComplementares);

  const handleSubmitForm = useCallback(async (data) => {
    console.log(data);

    try {
      const response = await api.post<ComplementaryActivity>(`/api/activities/create`, {
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

  return (
    <>
      <p>{JSON.stringify(data)}</p>
       {data?.user?.image && <Image
        src={data?.user?.image}
        alt='dsa' 
        width={150}
        height={150}
      />}
      <h2>Olá, {data?.user?.name}!</h2><br />

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

export const getServerSideProps: GetServerSideProps = async () => {

  const complementaryActivity = await prisma.complementaryActivity.findMany({
    where: {
      NOT: {
        status: 'recused'
      }
    },
  });

  const dataComplementaryActivity = complementaryActivity.map((activie) => {
    return {
      id: activie.id,
      description: activie.description,
      companyName: activie.companyName,
      cnpj: activie.cnpj,
      informedTime: activie.informedTime,
      integralizedTime: activie.integralizedTime,
      justification: activie.justification,
      certificateUrl: activie.certificateUrl,
      isActive: activie.isActive,
      status: activie.status,
      createdAt: activie.createdAt.toISOString(),
      updatedAt: activie.updatedAt.toISOString(),
    }
  })

  console.log('dataAtividadesComplementares::::: ', dataComplementaryActivity)
  return {
    props: {
      atividadesComplementares: dataComplementaryActivity,
    }
  }
}