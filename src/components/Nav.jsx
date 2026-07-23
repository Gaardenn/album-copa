import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/Nav.css";
import { faBook, faRepeat } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

export function Nav({ tab, setTab }) {
    return(
        <div className="tabbar">
            <Link to="/" className={`tab ${tab === 0 ? "active" : ""}`} onClick={() => setTab(0)}>
                <div className="icon"><FontAwesomeIcon icon={faBook} /></div>
                <div>Álbum</div>
            </Link>
            <Link to="/repetidas" className={`tab ${tab === 1 ? "active" : ""}`} style={{ position: "relative" }} onClick={() => setTab(1)}>
                <div className="icon"><FontAwesomeIcon icon={faRepeat} /></div>
                <div>Repetidas</div>
            </Link>
        </div>
    )
}