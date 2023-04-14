import { Link } from "react-router-dom";

export default function LandingPage(props) {
    return (
        <>
            <main>
            <ul>
                <li>
                    <Link to="/geo-distro">geo-Distro</Link>
                </li>
                <li>
                    <Link to="/impact-spider">impact-spider</Link>
                </li>
                <li>
                    <Link to="/aid-politics">aid-politics</Link>
                </li>
                <li>
                    <Link to="/associated-disaster">associated-disaster</Link>
                </li>
            </ul>
            </main>
        </>
    );
}
