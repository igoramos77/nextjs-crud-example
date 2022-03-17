import { GetServerSideProps } from 'next';
import { signOut, useSession } from 'next-auth/react';

import Image from 'next/image';
import { AtividadeComplementar, Task } from '@prisma/client';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { prisma } from '../../lib/prisma';

type TaskProps = {
  tasks: Task[];
}

type AtividadeComplementarProps = {
  atividadesComplementares: AtividadeComplementar[];
}

export default function App({ tasks, atividadesComplementares }) {
  console.log('props: ', atividadesComplementares)
  const { data, status } = useSession();
  
  const [allTasks, setAllTasks] = useState<Task[]>(tasks);
  const [newTask, setNewTask] = useState('');
  
  const [allAtividadesComplementares, setAllAtividadesComplementares] = useState<AtividadeComplementar[]>(atividadesComplementares);

  const handleCreateTask = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    await fetch(`http://localhost:3000/api/tasks/create`, {
      method: 'POST',
      body: JSON.stringify({ title: newTask }),
      headers: { 'Content-Type': 'application/json' }
    });

    setAllTasks([
      ...allTasks,
      {
        id: crypto.randomUUID(),
        title: newTask,
        isDone: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  }, [newTask, allTasks]);

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

      <ul>
        {allTasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>


      <h2>Create a new task</h2>
      <form onSubmit={handleCreateTask}>
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} /> <br/><br/>
        <button type="submit">Create task!</button>
      </form>

      <br/><br/>
      <h2>Lista de atividades:</h2>

      {console.log('atividadesComplementares: ', atividadesComplementares)}

      <ul>
        {allAtividadesComplementares?.map((atividade) => (
          <li key={atividade.id}>{atividade.descricao}</li>
        ))}
      </ul>
      <br/><br/>
      <button onClick={() => signOut()}>Logout!</button>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tasks = await prisma.task.findMany({
    where: {
      //isDone: false,
    }
  });

  const dataTasks = tasks.map((task) => {
    return {
      id: task.id,
      title: task.title,
      isDone: task.isDone,
      date: task.createdAt.toISOString(),
    }
  });

  const atividadesComplementares = await prisma.atividadeComplementar.findMany({
    where: {
      status: 'in_validation'
    }
  });

  const dataAtividadesComplementares = atividadesComplementares.map((atividade) => {
    return {
      id: atividade.id,
      descricao: atividade.descricao,
      cnpj: atividade.cnpj,
      carga_horaria_informada: atividade.carga_horaria_informada,
      carga_horaria_integralizada: atividade.carga_horaria_integralizada,
      justificativa: atividade.justificativa,
      certificado: atividade.certificado,
      is_active: atividade.is_active,
      status: atividade.status,
      //createdAt: atividade.createdAt.toISOString(),
      //updatedAt: atividade.updatedAt.toISOString(),
    }
  })

  console.log('dataAtividadesComplementares::::: ', dataAtividadesComplementares)
  return {
    props: {
      tasks: dataTasks,
      atividadesComplementares: dataAtividadesComplementares,
    }
  }
}