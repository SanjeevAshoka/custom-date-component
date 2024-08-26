import React from 'react';
import './App.css';
import DateTime from './components/mine/DateTime';
import { AppProvider } from './Context/Context';


const App: React.FC = () => {
    return (
        <AppProvider>
            <div className='appRoot'>
                <DateTime />
            </div>
        </AppProvider>
    );
};

export default App;
