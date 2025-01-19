// ===================================
// Componente Principal de la Aplicación
// ===================================

/**
* @fileoverview Componente raíz de la aplicación que define la estructura principal
* y el sistema de rutas
*/

import { Routes, Route } from "react-router-dom";
import FlowsViews from "./views/FlowsViews";
import FlowView from "./views/FlowDetailView";
import NotFound from "./views/NotFound";
import NavbarComponent from "./components/layout/NavbarComponent";
import FooterComponent from "./components/layout/FooterComponent";
import MoviesProvider from "./context/FlowsContext";

/**
* @component App
* @description Componente principal que estructura la aplicación y define las rutas disponibles
* 
* Estructura:
* - Navbar (header)
* - Contenido principal con rutas
* - Footer
* 
* @returns {JSX.Element} Aplicación renderizada con sistema de rutas y layout básico
*/
const App = () => {
 return (
   <>
     <div className="min-h-screen d-flex flex-column">
       {/* Barra de navegación superior */}
       <NavbarComponent />

       {/* 
        * Provider de contexto para flujos
        * Envuelve las rutas para que todos los componentes tengan acceso al contexto
        */}
       <MoviesProvider>
         <Routes>
           {/* Ruta principal - Lista de flujos */}
           <Route path="/" element={<FlowsViews />} />
           
           {/* Ruta de detalle de flujo con parámetro id */}
           <Route path="/flujo/:id" element={<FlowView />} />
           
           {/* Ruta para manejar URLs no encontradas */}
           <Route path="*" element={<NotFound />} />
         </Routes>
       </MoviesProvider>

       {/* Pie de página */}
       <FooterComponent />
     </div>
   </>
 );
}

export default App;