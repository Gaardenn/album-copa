import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/Nav.css";
import { faBook, faGear, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router";

export function Nav() {
    return(
        <div className="tabbar">
            <NavLink to="/" end className={({isActive}) => `tab ${isActive ? "active" : ""}`}>
                <FontAwesomeIcon icon={faBook} className="icon" />
                <div>Álbum</div>
            </NavLink>
            <NavLink to="/repetidas" className={({isActive}) => `tab ${isActive ? "active" : ""}`}>
                <FontAwesomeIcon icon={faRepeat} className="icon" />
                <div>Repetidas</div>
            </NavLink>
            <NavLink to="/ajustes" className={({isActive}) => `tab ${isActive ? "active" : ""}`}>
                <FontAwesomeIcon icon={faGear} className="icon" />
                <div>Ajustes</div>
            </NavLink>
        </div>
    )
}