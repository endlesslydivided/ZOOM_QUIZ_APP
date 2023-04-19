import { List, Space, Typography } from "antd";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../hooks/redux";
import { useNotify } from "../../hooks/useNotify";
import './ResultsList.scss';
import ResultsListItem from "./ResultsListItem";
import { useGetPlaySessionsResultsQuery } from "../../services/PlaySessionsApiSlice";
import { setResults } from "../../store/slices/ResultsSlice";

interface ResultsListProps
{

}



const ResultsList:React.FC<ResultsListProps> = () =>
{
    const results:any = useAppSelector((state:any) => state.results);

    const dispatch = useDispatch();

    const resultsQueryResult = useGetPlaySessionsResultsQuery({});

    useNotify(
        {
            result:resultsQueryResult,
            successCB:() =>
            {
                const data = resultsQueryResult.data;
                dispatch(setResults(data));
            }
    }) 

 

    return (
        <Space size={'middle'} direction="vertical">
    
        <Typography.Title level={4} type={"secondary"}>Your quizzes results:</Typography.Title>

        <List 
          itemLayout="vertical" 
          className="results-list" 
          split={true} 
          loading={resultsQueryResult.isFetching} 

          grid={{gutter:10,column:1}}
          dataSource={results}
          renderItem={(result:any) => <ResultsListItem result={result}/>}/>
        </Space>
    )

}

export default ResultsList;

