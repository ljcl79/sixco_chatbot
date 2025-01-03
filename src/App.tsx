
import { Routes, Route } from "react-router-dom";
import FlowsViews from "./views/FlowsViews";
import FlowDetailViews from "./views/FlowDetailViews"
import NavbarComponent from "./components/NavbarComponent";
import FooterComponent from "./components/FooterComponent";
import MoviesProvider from "./context/FlowsContext";
const App = () => {
  return (
    <>

      <div className="min-h-screen d-flex flex-column">
        <NavbarComponent />
        <MoviesProvider>

          <Routes>
            <Route path="/" element={<FlowsViews />}></Route>
            <Route path="/flujo/:id" element={<FlowDetailViews/>}></Route>
          </Routes>
        </MoviesProvider>

        <FooterComponent />
      </div>
    </>
  );
}

export default App;
