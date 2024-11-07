import './App.css';
import Add from './add'
import Navbar from './navbar';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ChatInterface from './Chat-Interface';
import RAG from './RAG';
import Home from './Home';
import KB from './KB';
import ADR from './adr';
import AKBInterface from './AkbInterface';


// This is the main component of the React application. It sets up the routing for the entire application using React Router. It defines the layout structure and routes for different pages like Home, ADR, and AKBInterface.

const Layout = () => {
  return (
    <div>
      <div >
        <Navbar></Navbar>
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="addsource" element={<Add />} />
            <Route path="adr" element={<ADR />} />
            {/* <Route path="getdecision" element={<ChatInterface />} /> */}
            {/* <Route path="akb_chat" element={<AKBInterface api={"AKB"} />} /> */}
            <Route path="adr_chat" element={<AKBInterface api={"ADR"} />} />
            {/* <Route path="add_kb" element={<KB />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;
