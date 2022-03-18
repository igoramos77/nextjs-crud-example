import { GetServerSideProps } from 'next';
import { signOut, useSession } from 'next-auth/react';

import api from '../../src/services/api';

import Image from 'next/image';
import { ComplementaryActivity, EStatus } from '@prisma/client';
import { FormEvent, useCallback, useState } from 'react';

import { prisma } from '../../lib/prisma';

export default function App({ atividadesComplementares }) {
  const { data, status } = useSession();
  
  const [description, setDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [informedTime, setInformedTime] = useState(0);
  
  const [allAtividadesComplementares, setAllAtividadesComplementares] = useState<ComplementaryActivity[]>(atividadesComplementares);

  const handleCreateTask = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post<ComplementaryActivity>(`/api/activities/create`, {
        description: description, 
        companyName: companyName,
        cnpj: cnpj,
        informedTime: informedTime,
        certificateUrl: certificateUrl,
      });
  
      console.log(response.data);

      setAllAtividadesComplementares([
        ...allAtividadesComplementares,
        response.data
      ]);

    } catch (error) {
      console.log(error)      
    }
    
  }, [description, companyName, cnpj, informedTime, certificateUrl, allAtividadesComplementares]);

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
      <form onSubmit={handleCreateTask}>
        <label>Descrição do certificado</label><br />
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /> <br/><br/>

        <label>Nome da Empresa</label><br />
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} /> <br/><br/>

        <label>CNPJ da Empresa</label><br />
        <input type="text" value={cnpj} onChange={(e) => setCnpj(e.target.value)} /> <br/><br/>

        <label>Certificado Url</label><br />
        <input type="text" value={certificateUrl} onChange={(e) => setCertificateUrl(e.target.value)} /> <br/><br/>

        <label>Carga horária informada</label><br />
        <input type="text" value={informedTime} onChange={(e) => setInformedTime(Number(e.target.value))} /> <br/><br/>

        <button type="submit">Create activitie!</button>
      </form>

      <br/><br/>
      <h2>Lista de atividades:</h2>

      {console.log('atividadesComplementares: ', atividadesComplementares)}

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