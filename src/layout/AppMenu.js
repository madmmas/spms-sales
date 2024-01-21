import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import systemadmin from './menu/systemadmin';
import manager from './menu/manager';
import sales from './menu/sales';

// get user role
const AppMenu = () => {

    const { user: currentUser } = useSelector((state) => state.auth);

    const [model, setModel] = React.useState([]);

    useEffect(() => {
        if (currentUser) {
            // console.log("currentUser::user-role", currentUser.user.role);   
            if(currentUser.user.role==="ROOT"){
                setModel(systemadmin);
            } else if(currentUser.user.role==="ADMIN"){
                setModel(manager);
            } else if(currentUser.user.role==="USER"){
                setModel(sales);
            }
        }
    }, [currentUser]);

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
