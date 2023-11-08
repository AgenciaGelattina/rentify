import { IListItem } from '@phoxer/react-components';
import { Insights, Group, ManageAccounts } from '@mui/icons-material';

export const createListItems = (role: number): IListItem[] =>  {

    return [
        {
            label: "Propiedades",
            value: "/properties",
            icon: <Insights />
        },
        {
            label: "Mi Cuenta",
            value: "/accounts/account",
            icon: <ManageAccounts />
        },
        {
            label: "ADMINISTRACIÓN",
            expanded: false,
            listItems: [
                {
                    label: "Propiedades",
                    value: "/admin/properties",
                    icon: <Insights />
                },
                {
                    label: "Grupos",
                    value: "/admin/properties/groups",
                    icon: <Group />
                },
                {
                    label: "Tipo de propiedades",
                    value: "/admin/properties/types",
                    icon: <Group />
                },
                {
                    label: "Estados",
                    value: "/admin/properties/status",
                    icon: <Group />
                },
                {
                    label: "Cuestas de usuarios",
                    value: "admin/accounts",
                    icon: <Group />
                },
                {
                    label: "Roles",
                    value: "/accounts/roles",
                    icon: <Group />
                },
            ]
        },
    ]
};