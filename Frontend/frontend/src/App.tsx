import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import NoPage from './pages/NoPage';

function App() {


  return (
    <div className="wrapper">
          <BrowserRouter>
            <Routes>
              <Route index element={<MainPage />} />
              <Route path='/index.html' element={<MainPage />} />
              <Route path='*' element={<NoPage />} />
            </Routes>
          </BrowserRouter>
    </div>
  );
}

export default App;

