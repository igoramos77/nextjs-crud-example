import { GetServerSideProps } from 'next';
import { getSession, signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import { useCallback, useEffect } from 'react';

export const getServerSideProps: any = async ({ req }) => {
  const sesstion = await getSession({ req });

  if (sesstion) {
    return {
      redirect: { 
        destination: '/app/',
        permament: false,
       }
    }
  }

  return {
    props: {

    }
  }
}

export default function Home() {
  const { data, status } = useSession();

  const handleSignIn = useCallback(() => {
    signIn('github');
  }, []);

  return (
    <>
      <main>
        <p>{JSON.stringify(data)}</p>
        <form onSubmit={handleSignIn}>
          <h1>Login</h1>
          <label htmlFor="email">E-mail</label><br />
          <input type="email" name="email" id="email" /> 
          <br /><br />
          <label htmlFor="password">Senha</label><br />
          <input type="password" name="password" id="password" />
          <br /><br />
          <button type="submit">Entrar</button>
        </form>
      </main>
      <br />
      <button onClick={handleSignIn}>entrar com github</button>
    </>
  )
}
