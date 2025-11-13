
export const PERMISSIONS = {
    DASHBOARD_VIEW: 'dashboard:view',

    PRODUCTS_VIEW: 'products:view',
    PRODUCTS_CREATE: 'products:create',
    PRODUCTS_EDIT: 'products:edit',
    PRODUCTS_DELETE: 'products:delete',

    CATEGORIES_VIEW: 'categories:view',
    CATEGORIES_CREATE: 'categories:create',
    CATEGORIES_EDIT: 'categories:edit',
    CATEGORIES_DELETE: 'categories:delete',
    
    ORDERS_VIEW: 'orders:view',
    ORDERS_EDIT: 'orders:edit',

    CUSTOMERS_VIEW: 'customers:view',
    CUSTOMERS_EDIT: 'customers:edit',
    CUSTOMERS_DELETE: 'customers:delete',

    ROLES_VIEW: 'roles:view',
    ROLES_CREATE: 'roles:create',
    ROLES_EDIT: 'roles:edit',
    ROLES_DELETE: 'roles:delete',
    
    ANALYTICS_VIEW: 'analytics:view',

    SETTINGS_VIEW: 'settings:view',
    SETTINGS_EDIT: 'settings:edit',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export const PERMISSION_GROUPS = [
    {
        group: 'Dashboard',
        permissions: [
            { id: PERMISSIONS.DASHBOARD_VIEW, label: 'View Dashboard' },
        ]
    },
    {
        group: 'Products',
        permissions: [
            { id: PERMISSIONS.PRODUCTS_VIEW, label: 'View Products' },
            { id: PERMISSIONS.PRODUCTS_CREATE, label: 'Create Products' },
            { id: PERMISSIONS.PRODUCTS_EDIT, label: 'Edit Products' },
            { id: PERMISSIONS.PRODUCTS_DELETE, label: 'Delete Products' },
        ]
    },
    {
        group: 'Categories',
        permissions: [
            { id: PERMISSIONS.CATEGORIES_VIEW, label: 'View Categories' },
            { id: PERMISSIONS.CATEGORIES_CREATE, label: 'Create Categories' },
            { id: PERMISSIONS.CATEGORIES_EDIT, label: 'Edit Categories' },
            { id: PERMISSIONS.CATEGORIES_DELETE, label: 'Delete Categories' },
        ]
    },
    {
        group: 'Orders',
        permissions: [
            { id: PERMISSIONS.ORDERS_VIEW, label: 'View Orders' },
            { id: PERMISSIONS.ORDERS_EDIT, label: 'Edit Orders (e.g., update status)' },
        ]
    },
    {
        group: 'Customers',
        permissions: [
            { id: PERMISSIONS.CUSTOMERS_VIEW, label: 'View Customers' },
            { id: PERMISSIONS.CUSTOMERS_EDIT, label: 'Edit Customers' },
            { id: PERMISSIONS.CUSTOMERS_DELETE, label: 'Delete Customers' },
        ]
    },
    {
        group: 'Roles & Permissions',
        permissions: [
            { id: PERMISSIONS.ROLES_VIEW, label: 'View Roles' },
            { id: PERMISSIONS.ROLES_CREATE, label: 'Create Roles' },
            { id: PERMISSIONS.ROLES_EDIT, label: 'Edit Roles' },
            { id: PERMISSIONS.ROLES_DELETE, label: 'Delete Roles' },
        ]
    },
    {
        group: 'Analytics',
        permissions: [
            { id: PERMISSIONS.ANALYTICS_VIEW, label: 'View Analytics' },
        ]
    },
    {
        group: 'Settings',
        permissions: [
            { id: PERMISSIONS.SETTINGS_VIEW, label: 'View Settings' },
            { id: PERMISSIONS.SETTINGS_EDIT, label: 'Edit Settings' },
        ]
    },
];
