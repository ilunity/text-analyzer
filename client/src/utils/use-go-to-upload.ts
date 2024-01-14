import {APP_PAGES, useCurrentPageContext} from "../components/CurrentPageContextProvider/context.ts";

export const useGoToUpload = () => {
    const {setPagePayload} = useCurrentPageContext()

    return () => setPagePayload({
        page: APP_PAGES.UPLOAD,
        data: null,
    })
}
