import { AxiosResponse } from 'axios';

export type ApiRequestFnResponse<DataType> = Promise<AxiosResponse<DataType>>;
export type ApiRequestFn<DataType> = () => ApiRequestFnResponse<DataType>;

export interface IApiError {
  status: number;
  message: string;
}

/** --------------------------------------------- */

export type TagsMap = Record<string, number>;

export type AnalyseTextResponse = ApiRequestFnResponse<string>;
export type AnalyseResultResponse = ApiRequestFnResponse<TagsMap>;
