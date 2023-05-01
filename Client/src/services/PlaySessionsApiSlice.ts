import { Report, Filters } from "../types/serviceSliceTypes";
import { UserPlaySession, UserPlaySessionResult } from "../types/storeSliceTypes";
import { apiSlice } from "./ApiSlice";


export const PlaySessionsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getPlaySessions: builder.query<UserPlaySession[],null>({
            query: () => ({
                url: '/play-sessions',
                method: 'GET'
            }),
        }),
        getPlaySessionReport: builder.query<Report,{psId:string}>({
            query: ({psId}) => ({
                url: `/play-sessions/${psId}/report`,
                method: 'GET',
            }),
        }),
        getPlaySessionsResults: builder.query<UserPlaySessionResult,{filters:Filters}>({
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