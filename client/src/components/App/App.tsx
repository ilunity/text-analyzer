import {
  APP_PAGES,
  CurrentPagePayload,
  useCurrentPageContext,
} from '../CurrentPageContextProvider/context.ts';
import { LoadingPage } from '../../pages/LoadingPage';
import { ErrorPage } from '../../pages/ErrorPage';
import { ResultPage } from '../../pages/ResultPage';
import { UploadFilePage } from '../../pages/UploadFilePage';

const defineCurrentPage = (pagePayload: CurrentPagePayload) => {
  if (pagePayload.page === APP_PAGES.LOADING) {
    return <LoadingPage />;
  }

  if (pagePayload.page === APP_PAGES.ERROR) {
    return <ErrorPage { ...pagePayload.data } />;
  }

  if (pagePayload.page === APP_PAGES.RESULT) {
    return <ResultPage tags={ pagePayload.data } />;
  }

  return <UploadFilePage />;
};

export const App: React.FC = () => {
  const { pagePayload } = useCurrentPageContext();

  return <>{ defineCurrentPage(pagePayload) }</>;
};
