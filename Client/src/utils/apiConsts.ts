enum ApiControllerPath {
    AUTH = '/auth',
    QUIZ = '/quizzes',
    PLAY_SESSION = '/play-sessions',
    CONTEXT = '/context'
}


/*#region Play session api consts*/
export const GET_PLAY_SESSIONS_URI = ApiControllerPath.PLAY_SESSION;
export const GET_PLAY_SESSIONS_REPORT_URI = (psId:string) => `${ApiControllerPath.PLAY_SESSION}/${psId}/report`;
export const GET_PLAY_SESSIONS_RESULTS_URI = `${ApiControllerPath.PLAY_SESSION}/results`;
/*#endregion*/

/*#region Quiz api consts*/
export const GET_USER_QUIZZES_URI = ApiControllerPath.QUIZ;
export const CREATE_QUIZ_URI = ApiControllerPath.QUIZ;
export const DELETE_QUIZ_URI = (quizId:string) =>  `${ApiControllerPath.QUIZ}/${quizId}`;
/*#endregion*/

/*#region Auth api consts*/
export const GET_CONTEXT = ApiControllerPath.CONTEXT;
export const GET_TOKEN = `${ApiControllerPath.AUTH}/token`;
export const GET_ME = `${ApiControllerPath.AUTH}/me`;
export const REFRESH_TOKEN = `${ApiControllerPath.AUTH}/refresh-token`;
/*#endregion*/
