import {
    AppstoreOutlined
} from "@ant-design/icons"
import {RouteType} from "./Models";
import Dashboard from "./Views/Dashboard";
import Page404 from "./Components/Page404";

const Routes: RouteType[] = [
    {
        path: "/error/404",
        name: "Dashboard",
        icon: AppstoreOutlined,
        component: Page404,
        layout: "/admin",
        isSidemenu: false,
    },
    {
        path: "/index",
        name: "Dashboard",
        icon: AppstoreOutlined,
        component: Dashboard,
        layout: "/admin",
        isSidemenu: false,
    },
]

export default Routes;
