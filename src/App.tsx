
import { Routes, Route } from "react-router-dom";
import FlowsViews from "./views/FlowsViews";
import FlowView from "./views/FlowDetailView"
import NavbarComponent from "./components/layout/NavbarComponent";
import FooterComponent from "./components/layout/FooterComponent";
import MoviesProvider from "./context/FlowsContext";
const App = () => {
  return (
    <>

      <div className="min-h-screen d-flex flex-column">
        <NavbarComponent />
        <MoviesProvider>

          <Routes>
            <Route path="/" element={<FlowsViews />}></Route>
            <Route path="/flujo/:id" element={<FlowView/>}></Route>
          </Routes>
        </MoviesProvider>

        <FooterComponent />
      </div>
    </>
  );
}

export default App;
