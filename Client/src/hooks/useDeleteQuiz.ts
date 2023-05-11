import { useCallback } from 'react';
import { useDeleteQuizMutation } from '../services/QuizzesApiSlice';
import { deleteQuiz } from '../store/slices/QuizzesSlice';
import { Quiz } from '../types/entityTypes';
import { useAppDispatch } from './redux';
import { useNotify } from './useNotify';

interface UseDeleteQuizParams {
    entity: Quiz;
}

export const useDeleteQuiz = ({ entity }: UseDeleteQuizParams) => {
    const dispatch = useAppDispatch();

    const [deleteQuizQuery, deleteQuizResult] = useDeleteQuizMutation();

    useNotify({
        result: deleteQuizResult,
        successCB: () => {
            dispatch(deleteQuiz(entity.id));
        },
        errorMessage: 'Some error occured on server',
    });

    const onDeleteClickHandler = useCallback(() => deleteQuizQuery({ quizId: entity.id }),[entity.id]);

    return { onDeleteClickHandler };
};
