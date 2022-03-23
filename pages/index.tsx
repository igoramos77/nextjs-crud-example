import { useCallback, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from './app/contexts/AuthContext';


export const getServerSideProps: any = async ({ req }) => {
  const sesstion = false;

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
  const { register, handleSubmit } = useForm();
  const { signIn } = useContext(AuthContext);
  
  const handleLogin = useCallback(async (data) => {
    console.log(JSON.stringify(data));
    
    await signIn(data);
  }, [signIn]);

  return (
    <>
      <main>
        <form onSubmit={handleSubmit(handleLogin)}>
          <h1>Login</h1>
          <label htmlFor="matricula">Matricula</label><br />
          <input {... register('matricula')} type="text" name="matricula" id="matricula" /> 
          <br /><br />
          <label htmlFor="password">Senha</label><br />
          <input {... register('password')} type="password" name="password" id="password" />
          <br /><br />
          <button type="submit">Entrar</button>
        </form>
      </main>
    </>
  )
}
