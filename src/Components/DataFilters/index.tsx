//** 1.0.0 | www.phoxer.com */
import { JSXElementConstructor, ReactElement, useEffect, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, ButtonGroup, Divider } from "@mui/material";
import Grid, { Grid2Props } from '@mui/material/Grid2';
import { ExpandMore, FilterList } from '@mui/icons-material';
import { Controller, ControllerRenderProps, FieldValues, FormState, UseFormReturn } from "react-hook-form";
import { isNil, isEmpty } from 'ramda';

export interface IDataFilter {
    dataKey: string;
    component: (field: ControllerRenderProps<FieldValues, string>, formState: FormState<FieldValues>, defaultValue?: any) => ReactElement<any, string | JSXElementConstructor<any>>;
    gridItemProps?: { [key: string]: any };
}

type TFilters = {
    filters: IDataFilter[];
    formData: UseFormReturn<FieldValues, any, undefined>;
    loading: boolean;
    onFilter: (data: FieldValues) => void;
    expanded?: boolean;
    filterOnMount?: boolean;
    gridContainerProps?: Grid2Props;
}

const DataFilters: React.FC<TFilters> = ({ filters, onFilter, loading, formData, filterOnMount = true, gridContainerProps = { spacing: 2 }, expanded = true}) => {
    const [filterExpanded, setFilterExpanded] = useState(expanded);
    const { control, handleSubmit, formState, reset, getValues } = formData;

    const checkFilterData = (data: FieldValues) => {
        const filterData = { ...data };
        for (const [key, value] of Object.entries(filterData)) {
            if (isNil(value) || isEmpty(value)) {
                delete filterData[key];
            }
        }
        onFilter(filterData);
    } 

    useEffect(() => {
        if (filterOnMount) {
            checkFilterData(getValues());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterOnMount]);

    return (<Accordion expanded={filterExpanded} onChange={() => setFilterExpanded(!filterExpanded)} sx={{ minHeight: 40, marginBottom: '1rem' }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          id="filter"
          sx={{ margin: 0 }}
        >
            <FilterList sx={{ marginRight: '.5rem' }} />
        </AccordionSummary>
        <AccordionDetails>
            <Box sx={{ padding: '.5rem' }}>
                <Grid container {...gridContainerProps}>
                    {filters.map((filter: IDataFilter) => {
                        return (<Grid key={filter.dataKey} {...filter.gridItemProps}>
                            <Controller name={filter.dataKey} control={control} render={({ field }) => {
                                return filter.component(field, formState);
                            }} />
                        </Grid>)
                    })}
                </Grid>
            </Box>
            <Divider />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '.5rem .5rem 0rem .5rem' }}>
                <ButtonGroup variant="contained" size="small">
                    <Button color="inherit" disabled={loading} onClick={() => reset()}>CLEAR</Button>
                    <Button color="primary" disabled={loading} onClick={handleSubmit((data) => checkFilterData(data))}>{loading? "FILTERING":"FILTER"}</Button>
                </ButtonGroup>
            </Box>
        </AccordionDetails>
    </Accordion>)
}

export default DataFilters;