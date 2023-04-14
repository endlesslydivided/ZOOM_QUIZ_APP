import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACK_SERVER_API,
    credentials: 'include'
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
