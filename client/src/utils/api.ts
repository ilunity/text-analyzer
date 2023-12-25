import { RcFile } from 'antd/es/upload';
import axios from 'axios';
import { AnalyseResultResponse, AnalyseTextResponse } from './api.types.ts';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

class Api {
  analyseText = async (file: RcFile): AnalyseTextResponse => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);

    const response = await axios.post(`${SERVER_URL}/analyse`, bodyFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response;
  };
  getAnalyseResult = async (id: string): AnalyseResultResponse => {
    const response = await axios.get(`${SERVER_URL}/result/${id}`);
    return response;
  };
}

export const api = new Api();
