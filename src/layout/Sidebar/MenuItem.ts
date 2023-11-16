export type MenuItem = {
    id: number;
    title: string;
    icon: string;
    path: string;
    secure: boolean
};

export function useMenuData() {

    const menuData: MenuItem[] = [
        { id: 1, title: 'Dashboard', icon: 'fs-5 bi bi-graph-down', path: '/', secure: true },
        { id: 2, title: 'XAI', icon: 'fs-5 bi bi-speedometer2', path: '/xai', secure: true},
        { id: 3, title: 'Fairness', icon: 'fs-5 bi bi-transparency', path: '/fairness', secure: true },
        { id: 4, title: 'Models', icon: 'fs-5 bi bi bi-file-bar-graph', path: '/models', secure: true },
        { id: 5, title: 'About', icon: 'fs-5 bi bi-speedometer2', path: '/about', secure: false},
        { id: 6, title: 'Contact', icon: 'fs-5 bi bi-phone ', path: '/contact', secure: false },

    ];

    return menuData;
}