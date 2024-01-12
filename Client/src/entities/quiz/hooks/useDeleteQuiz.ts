import { useCallback } from 'react';
import { useAppDispatch } from 'shared/hooks/redux';
import { useNotify } from 'shared/hooks/useNotify';

import { useDeleteQuizMutation } from '../api/slice';
import { deleteQuiz } from '../model/slice';
import { Quiz } from '../model/types';

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

    const onDeleteClickHandler = useCallback(
        () => deleteQuizQuery({ quizId: entity.id }),
        [entity.id]
    );

    return { onDeleteClickHandler };
};
