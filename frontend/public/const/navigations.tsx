import { Bell, Home, LineChart, Package, Package2, ShoppingCart, Users } from 'lucide-react'

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: <Home />
    },
    {
        key: 'Products',
        label: 'Products',
        path: '/products',
        icon: <Package />
    },
    {
        key: 'Orders',
        label: 'Orders',
        path: '/orders',
        icon: <ShoppingCart />
    },
    {
        key: 'Customers',
        label: 'Customers',
        path: '/customers',
        icon: <Users />
    },
    {
        key: 'Transactions',
        label: 'Transactions',
        path: '/transactions',
        icon: <LineChart />
    },
    {
        key: 'Messengers',
        label: 'Messengers',
        path: '/messengers',
        icon: <Bell />
    }
]
