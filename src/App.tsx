import React from 'react';
import './App.css'
import DateTime from './components/mine/DateTime.tsx';

const App: React.FC = () => {

    return (
        <div className='appRoot'>
            <h1 className='appHeader'>Select Start and End Date from UI below</h1>
            <DateTime />
        </div>
    );
};

export default App;
