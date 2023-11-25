import React, { useState } from 'react';
import './MenuStyles.scss';
import { useMenuData } from './MenuItem'; // Ensure this hook is defined and exports menu data
import { useOktaAuth } from "@okta/okta-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link, To} from "react-router-dom";

const Sidebar: React.FC = () => {
    const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
    const {authState, oktaAuth} = useOktaAuth();
    const menuItems = useMenuData(); // Ensure this returns the correct menu data structure

    if (!authState) {
        return <div>Loading...</div>;
    }

    const toggleSubmenu = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: number) => {
        event.preventDefault();
        setOpenSubmenu(openSubmenu === id ? null : id);
    };

    const handleLogout = async () => {
        await oktaAuth.signOut();
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='bg-dark col min-vh-100 d-flex justify-content-between flex-column'>
                    <div>
                        <Link to='/' className='text-decoration-none text-white d-flex align-items-center ms-3 mt-3'>
                            <span className='fs-5 d-none d-md-inline'>
                                <img
                                    src="/Logo.png"
                                    width="60"
                                    height="60"
                                    className="d-inline-block align-center"
                                    alt="Logo"
                                />
                            </span>
                        </Link>
                        <hr className='text-secondary'/>
                        <ul className='nav nav-pills flex-column mt-3'>
                            {menuItems
                                .filter((item) => authState.isAuthenticated || !item.secure)
                                .map((item) => (
                                    <li key={item.id} className="nav-item text-white my-1">
                                        <a href='#' className="nav-link text-white fs-5" aria-current="page"
                                           onClick={(e) => item.subItems && item.subItems.length > 0 ? toggleSubmenu(e, item.id) : null}>
                                            <i className={item.icon}></i>
                                            <span className='ms-3 d-none d-md-inline'>{item.title}</span>
                                        </a>
                                        {item.subItems && item.subItems.length > 0 && (
                                            <ul className={`submenu ${openSubmenu === item.id ? 'show' : ''}`}>
                                                {item.subItems.map((subItem: { id: React.Key | null | undefined; path: To; title: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
                                                    <li key={subItem.id} className="nav-subitem text-white my-1">
                                                        <Link to={subItem.path} className="nav-link text-white fs-5">
                                                            {subItem.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))
                            }

                            <li className="nav-item text-white my-1">
                                {authState.isAuthenticated ?
                                    <a onClick={handleLogout} className="nav-link text-white fs-5" aria-current="page">
                                        <i className='fs-5 bi bi-box-arrow-right'></i>
                                        <span className='ms-3 d-none d-md-inline'>Logout</span>
                                    </a> :
                                    <Link to='/login' className="nav-link text-white fs-5" aria-current="page">
                                        <i className='fs-5 bi bi-box-arrow-in-right'></i>
                                        <span className='ms-3 d-none d-md-inline'>Login</span>
                                    </Link>
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
