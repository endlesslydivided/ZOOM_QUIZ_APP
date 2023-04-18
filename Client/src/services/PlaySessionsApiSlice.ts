import { apiSlice } from "./ApiSlice";


export const PlaySessionsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPlaySessions: builder.query({
            query: () => ({
                url: '/play-sessions',
                method: 'GET'
            }),
        }),
        getPlaySessionsResults: builder.query({
            query: () => ({
                url: '/play-sessions/results',
                method: 'GET'
            }),
        }),
    })
})


export const {
    useGetPlaySessionsQuery,
    useGetPlaySessionsResultsQuery
} = PlaySessionsApiSlice;