import React from 'react';
import './MenuStyles.scss';
import { useMenuData} from './MenuItem';
import {useOktaAuth} from "@okta/okta-react";
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {Link} from "react-router-dom";

const Sidebar: React.FC = () => {

    const { authState, oktaAuth} = useOktaAuth();
    const menuItems  = useMenuData()
    if (!authState) {
        return <div>Loading...</div>;
    }

    const handleLogout = async () => {
        await oktaAuth.signOut();
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='bg-dark col min-vh-100 d-flex justify-content-between flex-column '>
                    <div>
                        <Link to='/' className='text-decoration-none text-white d-flex align-items-center ms-3 mt-3'>
                            <span className='fs-5 d-none d-md-inline'>
                                <img
                                    src="/Logo.png"
                                    width="60"
                                    height="60"
                                    className="d-inline-block align-center"
                                    alt=""
                                />
                            </span>
                        </Link>
                        <hr className='text-secondary'/>
                        <ul className='nav nav-pills flex-column mt-3'>

                            {
                                menuItems
                                    .filter((item) => authState.isAuthenticated || !item.secure)
                                    .map((item) => (

                                        <li key={item.id} className="nav-item text-white my-1">
                                            <Link to={item.path} className="nav-link text-white fs-5" aria-current="page">
                                                <i className={item.icon}></i>
                                                <span className='ms-3 d-none d-md-inline'>{item.title}</span>
                                            </Link>
                                        </li>
                                    ))
                            }

                            <li  className="nav-item text-white my-1">
                                {authState.isAuthenticated ?  <a onClick={handleLogout} className="nav-link text-white fs-5" aria-current="page">
                                    <i className='fs-5 bi bi-speedometer2'></i>
                                    <span className='ms-3 d-none d-md-inline'>{'Logout'}</span> </a> :
                                    <a href= '/login' className="nav-link text-white fs-5" aria-current="page">
                                        <i className='fs-5 bi bi-speedometer2'></i>
                                        <span className='ms-3 d-none d-md-inline'>{'LogIn'}</span> </a>
                                }

                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Sidebar;
