import { executeRequest, IApiResponse } from '../../utils/execute-request.ts';
import { api } from '../../utils/api.ts';
import { APP_PAGES, CurrentPagePayload } from '../../components/CurrentPageContextProvider/context.ts';
import { convertTagsType } from '../../utils/convert-tags-type.ts';
import { Dispatch, SetStateAction } from 'react';
import { TagsMap } from '../../utils/api.types.ts';

enum QUERY_RESULT_STATUSES {
  NOT_READY_YET = 202,
  EMPTY_RESULT = 204,
  REQUEST_TIMEOUT = 208,
}

export class QueryResultLoop {
  private currentRetries = 0;
  private setPayload: Dispatch<SetStateAction<CurrentPagePayload>>;
  private MAX_RETRIES = 10;
  private currentIntervalId = 0;
  private TIMEOUT = 3000;

  constructor(setPagePayload: Dispatch<SetStateAction<CurrentPagePayload>>, timeout = 3000) {
    this.setPayload = setPagePayload;
    this.TIMEOUT = timeout;
  }

  run = (id: string) => {
    const interval = setInterval(async () => {
      const response = await executeRequest(() => api.getAnalyseResult(id));
      this.currentRetries++;

      if (response.status === QUERY_RESULT_STATUSES.NOT_READY_YET) {
        if (this.currentRetries === this.MAX_RETRIES) {
          this.stop();
          this.setTimeoutError();
        }

        return;
      }

      this.handleReadyResponse(response);

      this.stop();
    }, this.TIMEOUT);
    this.currentIntervalId = interval;
  };

  private setTimeoutError = () => {
    this.setErrorResponse(
      QUERY_RESULT_STATUSES.REQUEST_TIMEOUT,
      'Истекло время ожидания результата',
    );
  };

  private handleReadyResponse = (response: IApiResponse<TagsMap>) => {
    const { status, success, data, error } = response;

    if (success) {
      return this.setSuccessPayload(
        status === QUERY_RESULT_STATUSES.EMPTY_RESULT
          ? {}
          : data,
      );
    }

    this.setErrorResponse(status, error);
  };

  private setSuccessPayload = (data: TagsMap) => {
    this.setPayload({
      page: APP_PAGES.RESULT,
      data: convertTagsType(data),
    });
  };

  private setErrorResponse = (status: number, message: string) => {
    this.setPayload({
      page: APP_PAGES.ERROR,
      data: { status, message },
    });
  };

  stop = () => {
    clearInterval(this.currentIntervalId);
    this.currentRetries = 0;
  };
}
