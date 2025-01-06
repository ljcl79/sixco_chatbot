import Navbar from 'react-bootstrap/Navbar';
import logo from "../../assets/img/logo.webp";

const NavbarComponent = () => {
  return (
    <>
      <Navbar className="custom-navbar ">
          <Navbar.Brand href="/" className="ms-5">
            <img
              src={logo}
              width="50"
              height="50"
              className="ms-2 rounded-circle" // añadido rounded-circle para hacerlo redondo
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
      </Navbar>
    </>
  )
}

export default NavbarComponent