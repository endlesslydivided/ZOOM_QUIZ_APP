import { apiSlice } from "./ApiSlice";


export const PlaySessionsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPlaySessions: builder.query({
            query: () => ({
                url: '/play-sessions',
                method: 'GET'
            }),
        }),
        getPlaySessionReport: builder.query({
            query: ({psId}) => ({
                url: `/play-sessions/${psId}/report`,
                method: 'GET',
            }),
        }),
        getPlaySessionsResults: builder.query({
            query: ({filters}) => ({
                url: '/play-sessions/results',
                method: 'GET',
                params:filters
            }),
        }),
    })
})


export const {
    useGetPlaySessionsQuery,
    useGetPlaySessionsResultsQuery,
    useLazyGetPlaySessionReportQuery
} = PlaySessionsApiSlice;