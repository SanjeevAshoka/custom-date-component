import React from 'react';
import './App.css'
import DateTime from './components/mine/DateTime.tsx';

const App: React.FC = () => {

    return (
        <div className='appRoot'>
            <h1 className='appHeader'>React Custom Date Picker Component</h1>
            <DateTime />
        </div>
    );
};

export default App;
