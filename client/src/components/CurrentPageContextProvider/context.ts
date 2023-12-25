import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { IApiError } from '../../utils/api.types.ts';

export enum APP_PAGES {
  UPLOAD = 'UPLOAD',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  RESULT = 'RESULT',
}

export interface Tag {
  name: string;
  value: number;
}

export type CurrentPagePayload =
  | {
      data: null;
      page: APP_PAGES.UPLOAD;
    }
  | {
      data: null;
      page: APP_PAGES.LOADING;
    }
  | {
      data: IApiError;
      page: APP_PAGES.ERROR;
    }
  | {
      data: Tag[];
      page: APP_PAGES.RESULT;
    };

export interface ICurrentPageContext {
  pagePayload: CurrentPagePayload;
  setPagePayload: Dispatch<SetStateAction<CurrentPagePayload>>;
}

export const initPagePayload: CurrentPagePayload = {
  data: null,
  page: APP_PAGES.UPLOAD,
};

const initPageContext: ICurrentPageContext = {
  pagePayload: initPagePayload,
  // eslint-disable-next-line no-empty-function
  setPagePayload: () => {},
};

export const CurrentPageContext = createContext<ICurrentPageContext>(initPageContext);

export const useCurrentPageContext = () => {
  const context = useContext(CurrentPageContext);
  return context;
};
