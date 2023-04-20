

import { deleteQuiz } from "../store/slices/QuizzesSlice";
import { useAppDispatch } from "./redux";
import { useNotify } from "./useNotify";
import {useDeleteQuizMutation} from '../services/QuizzesApiSlice'

interface UseDeleteQuizParams
{
    entity:any;
}

export const useDeleteQuiz= ({entity}:UseDeleteQuizParams) =>
{
    const dispatch = useAppDispatch();

	const [deleteQuizQuery, deleteQuizResult] = useDeleteQuizMutation();


    useNotify({
        result:deleteQuizResult,
        successCB:()=>  
        {
            dispatch(deleteQuiz(entity.id));
        },
        errorMessage:'Some error occured on server'
    });

    const onDeleteClickHandler = () => deleteQuizQuery({quizId:entity.id});


    return {onDeleteClickHandler};
}


