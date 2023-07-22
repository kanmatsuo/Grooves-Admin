import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import AdminLayout from "./pages/Admin/Layout";
import AdminHome from "./pages/Admin/Home";
import Create from "./pages/Admin/Create";
import MyNFTDetail from "./pages/Admin/components/MyNFT/Detail";
import AdminList from "./pages/Admin/List";
import AdminListDetail from "./pages/Admin/components/List/Detail";
import AdminAuction from "./pages/Admin/Auction";
import AdminAuctionDetail from "./pages/Admin/components/Auction/Detail";
import AdminGacha from "./pages/Admin/Gacha";
import History from "./pages/Admin/History";
import Sold from "./pages/Admin/Sold";
import SoldDetail from "./pages/Admin/components/Sold/Detail";
import AdminReward from "./pages/Admin/Reward";

import AdminLogin from "./pages/Admin/components/Auth/Login";
import ClientLogin from "./pages/Client/pages/auth/login";

import Signup from './pages/Client/pages/auth/signup';
import ResetPassword from './pages/Client/pages/auth/reset-password';

import ClientLayout from './pages/Client/Layout';
import ClientHome from "./pages/Client/pages/index/index";
import ProfileEdit from "./pages/Client/pages/profile/profile-edit";
import Contact from './pages/Client/pages/contact';
import Terms from './pages/Client/pages/terms';
import PrivacyPolicy from './pages/Client/pages/privacy-policy';
import FAQs from './pages/Client/pages/faqs';
import About from './pages/Client/pages/about';
import Blogs from './pages/Client/pages/blog/blogs';
import BlogDetail from './pages/Client/pages/blog/blog-detail';
import Error404 from "./pages/Client/pages/special/error";
import ClientAuction from "./pages/Client/pages/auction/auction";
import ClientAuctionDetail from "./pages/Client/pages/auction/detail";
import ClientProfile from "./pages/Client/pages/profile/user-profile";
import ClientList from "./pages/Client/pages/listing/listing";
import ClientListDetail from "./pages/Client/pages/listing/detail";
import ClientGacha from "./pages/Client/pages/gacha/gacha";
import ClientReward from "./pages/Client/pages/reward/reward";
import CollectedItems from "./pages/Client/pages/collection/collection";
import CollectedItemDetail from "./pages/Client/pages/collection/detail";

import socketIO from 'socket.io-client';
import config from "./pages/global/constant";

function App() {
  const [socket] = useState(socketIO.connect(config.socket_server_url));

  useEffect(() => {
    socket.on('update_ui', (data) => {
      console.log(data)
      childRef.current.init()
    });

    return () => {
      socket.off('update_ui');
    };
  }, [socket]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.classList.add('dark');
    document.body.classList.add('font-urbanist', 'text-base', 'text-black', 'dark:text-white', 'dark:bg-slate-900');
  });

  const childRef = useRef();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome ref={childRef} />} />
          <Route path="/admin/create" element={<Create ref={childRef} />} />
          <Route path="/admin/mynft/:id" element={<MyNFTDetail ref={childRef} />} />
          <Route path="/admin/list" element={<AdminList ref={childRef} />} />
          <Route path="/admin/list/:id" element={<AdminListDetail ref={childRef} />} />
          <Route path="/admin/auction" element={<AdminAuction ref={childRef} />} />
          <Route path="/admin/auction/:id" element={<AdminAuctionDetail ref={childRef} />} />
          <Route path="/admin/gacha" element={<AdminGacha ref={childRef} />} />
          <Route path="/admin/sold" element={<Sold ref={childRef} />} />
          <Route path="/admin/sold/:id" element={<SoldDetail ref={childRef} />} />
          <Route path="/admin/history" element={<History ref={childRef} />} />
          <Route path="/admin/reward" element={<AdminReward ref={childRef} />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/login" element={<ClientLogin />} />

        <Route path='/signup' element={<Signup />} />
        <Route path='/reset-password' element={<ResetPassword />} />


        <Route path="/" element={<ClientLayout />}>
          <Route index element={<ClientHome ref={childRef} />} />
          <Route path="/profile/:id" element={<ClientProfile ref={childRef} />} />
          <Route path='/blog-detail' element={<BlogDetail />} />
          <Route path='/auction' element={<ClientAuction ref={childRef} />} />
          <Route path='/auction/:id' element={<ClientAuctionDetail ref={childRef} />} />
          <Route path='/list' element={<ClientList ref={childRef} />} />
          <Route path='/list/:id' element={<ClientListDetail ref={childRef} />} />
          <Route path='/gacha' element={<ClientGacha ref={childRef} />} />
          <Route path='/reward' element={<ClientReward ref={childRef} />} />
          <Route path='/collection' element={<CollectedItems ref={childRef} />} />
          <Route path='/collection/:id' element={<CollectedItemDetail ref={childRef} />} />

          <Route path="*" element={<Error404 ref={childRef} />} />
          <Route path="/profile-edit" element={<ProfileEdit ref={childRef} />} />
          <Route path="/about-us" element={<About ref={childRef} />} />
          <Route path="/contact" element={<Contact ref={childRef} />} />
          <Route path='/terms' element={<Terms ref={childRef} />} />
          <Route path='/privacy' element={<PrivacyPolicy ref={childRef} />} />
          <Route path='/faq' element={<FAQs ref={childRef} />} />
          <Route path='/blog' element={<Blogs ref={childRef} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App