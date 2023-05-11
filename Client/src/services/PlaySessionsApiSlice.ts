import { Filters,Report } from '../types/serviceSliceTypes';
import {
    UserPlaySession,
    UserPlaySessionResult,
} from '../types/storeSliceTypes';
import { GET_PLAY_SESSIONS_REPORT_URI, GET_PLAY_SESSIONS_RESULTS_URI,GET_PLAY_SESSIONS_URI } from '../utils/apiConsts';
import { apiSlice } from './ApiSlice';

export const PlaySessionsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlaySessions: builder.query<UserPlaySession[], null>({
            query: () => ({
                url: GET_PLAY_SESSIONS_URI,
                method: 'GET',
            }),
        }),
        getPlaySessionReport: builder.query<Report, { psId: string }>({
            query: ({ psId }) => ({
                url: GET_PLAY_SESSIONS_REPORT_URI(psId),
                method: 'GET',
            }),
        }),
        getPlaySessionsResults: builder.query<
            UserPlaySessionResult,
            { filters: Filters }
        >({
            query: ({ filters }) => ({
                url: GET_PLAY_SESSIONS_RESULTS_URI,
                method: 'GET',
                params: filters,
            }),
        }),
    }),
});

export const {
    useGetPlaySessionsQuery,
    useGetPlaySessionsResultsQuery,
    useLazyGetPlaySessionReportQuery,
} = PlaySessionsApiSlice;
