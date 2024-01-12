import { Filters } from 'shared/models';

import { apiSlice } from '../../../shared/api/api';
import { UserPlaySessionResult } from '../../result';
import { PlaySessionReport, UserPlaySession } from '../model/types';

const BASE_URL = '/play-sessions';

/*#region Play session api consts*/
export const GET_PLAY_SESSIONS_URI = BASE_URL;
export const GET_PLAY_SESSIONS_REPORT_URI = (psId: string) =>
    `${BASE_URL}/${psId}/report`;
export const GET_PLAY_SESSIONS_RESULTS_URI = `${BASE_URL}/results`;
/*#endregion*/

export const PlaySessionsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlaySessions: builder.query<UserPlaySession[], null>({
            query: () => ({
                url: GET_PLAY_SESSIONS_URI,
                method: 'GET',
            }),
        }),
        getPlaySessionReport: builder.query<
            PlaySessionReport,
            { psId: string }
        >({
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
