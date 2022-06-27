import React, {ReactElement} from 'react';
import ReactDOM from 'react-dom/client';

import App from './Comonents/App/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Failed to find the root element');
}

const root = ReactDOM.createRoot(rootElement);

const WrappedWithTheme = (): ReactElement => {
    return (
        <App/>
    );
};
root.render(<WrappedWithTheme/>);
