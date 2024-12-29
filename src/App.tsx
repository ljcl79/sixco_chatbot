
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home"
import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";
const App=()=> {
  return (
    <>

        <div className="min-h-screen d-flex flex-column">
        <NavbarComponent/>
            <Routes>
              <Route path="/" element={<Home />}></Route>
            </Routes>
        <FooterComponent/>
        </div>
    </>
  );
}

export default App;
