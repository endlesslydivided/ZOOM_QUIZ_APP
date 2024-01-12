import './app/index.scss';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'shared/api/store';
import { createRoot } from 'react-dom/client';

import App from './app/App';

const AppContainer = () => {
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
                <App />;
            </BrowserRouter>
        </Provider>
    );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<AppContainer />);