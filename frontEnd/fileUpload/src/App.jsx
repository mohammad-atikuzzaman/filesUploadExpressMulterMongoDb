import { NavLink, Outlet } from "react-router-dom";
import "./index.css";

function App() {
  return (
    <>
      <div className="nav">
        <h2>FileUploader</h2>
        <ul className="menu">
          <li>
            <NavLink to="/">Upload Files</NavLink>
          </li>
          <li>
            <NavLink to="/show-files">Show Files</NavLink>
          </li>
        </ul>
      </div>
      <div className="outlet">
        <Outlet></Outlet>
      </div>
      <div className="footer">
        <h5>This is copyright reserved to@Akash</h5>
      </div>
    </>
  );
}

export default App;
