import { useEffect, useState } from 'react';

import { Filters } from '../types/serviceSliceTypes';
import { useAppDispatch } from './redux';
import { useNotify } from './useNotify';

interface usePagintaionParams {
    setContent:  Function;
    getContentCB:  Function;
    refetchOnMountOrArgChange?: boolean;
    filtersParams?: Filters;
}

const initialFilters: Filters = {
    page: 1,
    limit: 5,
};

export const usePagination = ({
    setContent,
    getContentCB,
    filtersParams,
    refetchOnMountOrArgChange = false,
}: usePagintaionParams) => {
    const dispatch = useAppDispatch();

    const [filters, setFilters] = useState({
        ...initialFilters,
        ...filtersParams,
    });
    const [pagesCount, setPagesCount] = useState(0);

    const getContentResult = getContentCB(
        { filters },
        { refetchOnMountOrArgChange: refetchOnMountOrArgChange }
    );

    useEffect(() => {
        getContentResult.refetch();
    }, [filters]);

    useNotify({
        result: getContentResult,
        successCB: () => {
            const result = getContentResult.data;

            const rows = result[0];
            const count = result[1];

            setPagesCount(count);

            dispatch(setContent(rows));
        },
        errorMessage: 'Some error occured on server',
    });

    return { pagesCount, setFilters, filters, getContentResult };
};
