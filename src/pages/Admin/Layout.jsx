import { Outlet } from "react-router-dom";
import MenuBar from "./MenuBar";

const Layout = () => {


    return (
        <div className="appAdmin">
            <MenuBar />
            <Outlet />
        </div>
    )
};

export default Layout;