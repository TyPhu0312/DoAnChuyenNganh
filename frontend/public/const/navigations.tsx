import { Bell, Home, LineChart, Package, Package2, ShoppingCart, Users } from 'lucide-react'

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'Categories',
        label: 'Categories',
        path: '/admin/categories',
        icon: <Package/>
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
        icon: <Package2 />
    },
    {
        key: 'User',
        label: 'User',
        path: '/admin/user',
        icon: <Users />
    },
    {
        key: 'Orders',
        label: 'Orders',
        path: '/admin/orders',
        icon: <ShoppingCart />
    },
    {
        key: 'Messengers',
        label: 'Messengers',
        path: '/admin/messengers',
        icon: <Bell />
    }
]
