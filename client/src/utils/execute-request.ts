import { ApiRequestFn } from './api.types.ts';
import { defineAxiosError } from './define-axios-error.ts';

export type IApiResponse<DataType> =
  | {
      data: DataType;
      error: null;
      success: true;
      status: number;
    }
  | {
      data: null;
      error: string;
      success: false;
      status: number;
    };

export const executeRequest = async <DataType>(
  requestFn: ApiRequestFn<DataType>,
): Promise<IApiResponse<DataType>> => {
  try {
    const response = await requestFn();

    if (response.status === 500) {
      return {
        data: null,
        error: 'Ошибка на сервере',
        success: false,
        status: 500,
      };
    }

    return {
      data: response.data,
      error: null,
      success: true,
      status: response.status,
    };
  } catch (error: any) {
    const { status, message } = defineAxiosError(error);
    return {
      data: null,
      error: message,
      success: false,
      status,
    };
  }
};
