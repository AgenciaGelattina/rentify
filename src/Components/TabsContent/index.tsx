import { FC, ReactNode, SyntheticEvent, useState } from "react";
import { Box, Tabs, TabsProps, BoxProps, Tab, TabProps } from "@mui/material";
import { getUIKey } from "@src/Utils";


export interface ITabContent {
    tab: TabProps;
    component: () => ReactNode;
}

type TTabsContent = {
    tabs: ITabContent[];
    defaultActiveTab?: number;
    mainBoxProps?: BoxProps;
    tabsProps?: TabsProps;
    contentBoxProps?: BoxProps;
}

const TabsContent: FC<TTabsContent> = ({ tabs, defaultActiveTab = 0, mainBoxProps, tabsProps, contentBoxProps }) => {
    const [selectedTab, setSelectedTab] = useState<number>(defaultActiveTab);

    const onTabChange= (e: SyntheticEvent<Element, Event>, tab: number) => {
        setSelectedTab(tab);
    }

    return (<Box sx={{ width: '100%' }} {...mainBoxProps}>
        <Tabs value={selectedTab} onChange={onTabChange} {...tabsProps}>
            {tabs.map((tabContent: ITabContent) => {
                return <Tab key={getUIKey()} {...tabContent.tab} />
            })}
        </Tabs>
        <Box {...contentBoxProps}>
            {tabs[selectedTab].component()}
        </Box>
    </Box>)
}

export default TabsContent;