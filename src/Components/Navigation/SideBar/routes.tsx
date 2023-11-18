import { IListItem } from '@phoxer/react-components';
import { Insights, Group, ManageAccounts, HomeWork, Apartment, AddHomeWork, HolidayVillage, DomainDisabled } from '@mui/icons-material';

export const createListItems = (role: number): IListItem[] =>  {

    return [
        {
            label: "Propiedades",
            value: "/properties",
            icon: <HomeWork />
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
                    icon: <AddHomeWork />
                },
                {
                    label: "- Tipos",
                    value: "/admin/properties/types",
                    icon: <DomainDisabled />
                },
                {
                    label: "- Estados",
                    value: "/admin/properties/statuses",
                    icon: <Apartment />
                },
                {
                    label: "Grupos",
                    value: "/admin/properties/groups",
                    icon: <HolidayVillage />
                },
                {
                    label: "- Tipos",
                    value: "/admin/properties/groups/types",
                    icon: <DomainDisabled />
                },
                {
                    label: "CUENTAS",
                    expanded: false,
                    listItems: [
                        {
                            label: "Cuestas de usuarios",
                            value: "/admin/accounts",
                            icon: <Group />
                        },
                        {
                            label: "Roles",
                            value: "/admin/accounts/roles",
                            icon: <Group />
                        },
                    ]
                }
            ]
        },
    ]
};