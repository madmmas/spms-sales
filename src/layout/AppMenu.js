import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const model = [
        {
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            ]
        },
        {
            label: 'HR',
            items: [
                {
                    label: 'Employee Management',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        { label: 'Profile', icon: 'pi pi-fw pi-list', to: '/emplist' },
                    ]
                },
            ]
        },
        {
            label: 'Office Setup',
            items: [
                {
                    label: 'Configuration',
                    icon: 'pi pi-fw pi-list',
                    items: [
                        { label: 'Demo Data', icon: 'pi pi-fw pi-list', to: '/demodata' },
                        { label: 'Demo Form', icon: 'pi pi-fw pi-list', to: '/form' },
                        { label: 'Demo Crud', icon: 'pi pi-fw pi-list', to: '/crud' },
                        { label: 'About', icon: 'pi pi-fw pi-home', to: '/about' },
                    ]
                },
            ]
        },
    ];

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
