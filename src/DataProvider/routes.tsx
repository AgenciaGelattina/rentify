import { IListItem } from '@src/Components/Navigation/List/ListItem/ListItem';
import { Group, ManageAccounts, HomeWork, Apartment, AddHomeWork, HolidayVillage, DomainDisabled, PendingActions, Payments, Assignment } from '@mui/icons-material';
import { getUIKey } from '@src/Utils';

export const createRoutesItems = (roleID: number): IListItem[] =>  {
    return [
        {
            id: getUIKey(),
            label: "Vencimientos",
            value: "/contracts/expiration",
            active: false,
            icon: <PendingActions />
        },
        {
            id: getUIKey(),
            label: "Cobranza",
            value: "/contracts/payments",
            active: false,
            icon: <Payments />
        },
        {
            id: getUIKey(),
            label: "Contratos",
            value: "/contracts",
            active: false,
            visible: (roleID <= 2),
            icon: <HomeWork />
        },
        {
            id: getUIKey(),
            label: "Mi Cuenta",
            value: "/accounts/account",
            active: false,
            icon: <ManageAccounts />
        },
        {
            id: getUIKey(),
            label: "ADMINISTRACIÓN",
            expanded: false,
            active: false,
            visible: (roleID <= 2),
            listItems: [
                {
                    id: getUIKey(),
                    label: "Propiedades",
                    value: "/admin/properties",
                    active: false,
                    icon: <AddHomeWork />,
                    listItems: [
                        {
                            id: getUIKey(),
                            label: "Tipos",
                            value: "/admin/properties/types",
                            active: false,
                            visible: (roleID === 1),
                            icon: <DomainDisabled />
                        },
                        {
                            id: getUIKey(),
                            label: "Estados",
                            value: "/admin/properties/statuses",
                            active: false,
                            visible: (roleID === 1),
                            icon: <Apartment />
                        },
                        {
                            id: getUIKey(),
                            label: "Asignaciones",
                            value: "/admin/properties/assignments",
                            active: false,
                            visible: (roleID === 1),
                            icon: <Assignment />
                        },
                    ]
                },
                {
                    id: getUIKey(),
                    label: "Grupos",
                    value: "/admin/properties/groups",
                    active: false,
                    icon: <HolidayVillage />,
                    listItems: [
                        {
                            id: getUIKey(),
                            label: "Tipos",
                            value: "/admin/properties/groups/types",
                            active: false,
                            visible: (roleID === 1),
                            icon: <DomainDisabled />
                        }
                    ]
                },
                {
                    id: getUIKey(),
                    label: "CUENTAS",
                    expanded: false,
                    visible: (roleID === 1),
                    listItems: [
                        {
                            id: getUIKey(),
                            label: "Cuestas de usuarios",
                            value: "/admin/accounts",
                            active: false,
                            visible: (roleID === 1),
                            icon: <Group />
                        },
                        {
                            id: getUIKey(),
                            label: "Roles",
                            value: "/admin/accounts/roles",
                            active: false,
                            visible: (roleID === 1),
                            icon: <Group />
                        }
                    ]
                }
            ]
        },
    ]
};