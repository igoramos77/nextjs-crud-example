import api from './api';

type SingInRequestData = {
  matricula: string;
  password: string;
}

export async function singInRequest(data: SingInRequestData) {

  try {
    const response = await api.post(`/api/login/auth`, {
      matricula: data.matricula,
      password: data.password,
    });

    console.log(response.data);
    return response.data;

  } catch (error) {
    console.log(error);
  }

}