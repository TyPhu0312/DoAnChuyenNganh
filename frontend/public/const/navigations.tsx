import { Bell, Home, LineChart, Package, Package2, ShoppingCart, Users } from 'lucide-react'

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: <Home/>
    },
    {
        key: 'Products',
        label: 'Products',
        path: '/admin/products',
        icon: <Package />
    },
    {
        key: 'CustomPainting',
        label: 'CustomPainting',
        path: '/admin/custompainting',
        icon: <ShoppingCart />
    },
    {
        key: 'User',
        label: 'User',
        path: '/admin/user',
        icon: <Users />
    },
    {
        key: 'Transactions',
        label: 'Transactions',
        path: '/admin/transactions',
        icon: <LineChart />
    },
    {
        key: 'Messengers',
        label: 'Messengers',
        path: '/admin/messengers',
        icon: <Bell />
    }
]
