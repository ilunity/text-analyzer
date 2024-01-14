import { Dispatch, SetStateAction } from 'react';
import { APP_PAGES, CurrentPagePayload } from '../../components/CurrentPageContextProvider/context.ts';
import { executeRequest } from '../../utils/execute-request.ts';
import { api } from '../../utils/api.ts';
import { ResultRequestLoop } from './result-request-loop.ts';
import { RcFile } from 'antd/es/upload';

enum RESPONSE_STATUSES {
  EMPTY_RESULT = 204,
}

export class AnalyseTextRequest {
  private setPayload: Dispatch<SetStateAction<CurrentPagePayload>>;

  constructor(setPagePayload: Dispatch<SetStateAction<CurrentPagePayload>>) {
    this.setPayload = setPagePayload;
  }

  execute = async (file: RcFile) => {
    const { success, data: id, error, status } = await executeRequest(() => api.analyseText(file));

    if (!success) {
      return this.setErrorResponse(status, error);
    }

    if (status === RESPONSE_STATUSES.EMPTY_RESULT) {
      return this.setErrorResponse(RESPONSE_STATUSES.EMPTY_RESULT, 'Загруженный файл не содержит текста');
    }

    const resultRequestLoop = new ResultRequestLoop(this.setPayload);
    resultRequestLoop.run(id as string);
  };

  private setErrorResponse = (status: number, message: string) => {
    this.setPayload({
      page: APP_PAGES.ERROR,
      data: { status, message },
    });
  };
}
