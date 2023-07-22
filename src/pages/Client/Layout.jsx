import { Outlet } from "react-router-dom";
import Footer from './components/footer';
import Navbar from './components/navbar';
import Switcher from './components/switcher';

const Layout = () => {
    return (
        <>
            <span className="fixed blur-[200px] w-[600px] h-[600px] rounded-full top-1/2 start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 bg-gradient-to-tl from-red-600/20 to-violet-600/20 dark:from-red-600/40 dark:to-violet-600/40 hidden dark:block"></span>
            <Navbar />
            <Outlet data="data" />
            <Footer />
            <Switcher />
        </>
    )
};

export default Layout;