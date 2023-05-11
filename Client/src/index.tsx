import './index.css';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { store } from './store/store';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const RootElement = () => {
    return (
        <Provider store={store}>
            <div className='area'>
                <ul className='circles'>
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                    <li />
                </ul>
            </div>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    );
};

root.render(<RootElement />);
