import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { store } from './store/store';

const codeChallenge =  "lkjqwp4rt9uq03wr";
const state = "TIA5UgoMte";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);



const RootElement = () =>
{

 

  return(
   
      <Provider store={store}>  
       <div className="area" >
            <ul className="circles">
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
                    <li/>
            </ul>
       </div > 
        <BrowserRouter>
            <App/>
        </BrowserRouter>
      </Provider>
  )
}

root.render(<RootElement/>);



 
