import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { RootState } from "../store/store";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACK_URI,
    credentials: 'include',
    prepareHeaders:(headers,{getState}) =>
    {

        const zoomContext:any = (getState() as RootState).zoomContext;
        const zoomContextParam = new URLSearchParams(window.location.search).get("context");

        if(zoomContext.context)
        {
            headers.set('x-zoom-app-context',zoomContext.context);
        }
        else if(zoomContextParam)
        {
            headers.set('x-zoom-app-context',zoomContextParam);
        }
        return headers;
      
    }
});

const baseQueryWithReauth = async (args?: any, api?: any, extraOptions?: any) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log(process.env.REACT_APP_BACK_URI);

    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({})
}) 
