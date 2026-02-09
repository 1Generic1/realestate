import "./App.css";
import { BrowserRouter, Routes } from "react-router-dom";
import Header from "./component/userpages/Header";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes></Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
