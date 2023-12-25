import React, { useState } from 'react';
import { CurrentPageContextProps } from './CurrentPageContext.types';
import { CurrentPageContext, CurrentPagePayload, initPagePayload } from './context.ts';

export const CurrentPageContextProvider: React.FC<CurrentPageContextProps> = ({ children }) => {
  const [pagePayload, setPagePayload] = useState<CurrentPagePayload>(initPagePayload);

  return (
    <CurrentPageContext.Provider
      value={ {
        pagePayload,
        setPagePayload,
      } }
    >
      { children }
    </CurrentPageContext.Provider>
  );
};
