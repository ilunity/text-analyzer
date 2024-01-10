import { AxiosError } from 'axios';
import { IApiError } from './api.types.ts';

interface IErrorResponseBody {
  status: number;
  statusText: string;
}

export const defineAxiosError = (error: AxiosError<IErrorResponseBody>): IApiError => {
  if (error.response) {
    const responseBody = error.response;

    return {
      status: responseBody.status,
      message: responseBody.statusText,
    };
  }

  if (error.request) {
    return {
      status: 503,
      message: 'Сервер не отвечает',
    };
  }

  return {
    status: -1,
    message: 'Неизвестная ошибка',
  };
};

