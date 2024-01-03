import { forwardRef, useMemo } from "react";
import { useFetchExpress } from "@phoxer/react-components";
import useDataResponse from "@src/Hooks/useDataResponse";
import { Autocomplete, AutocompleteProps, TextField } from "@mui/material";
import { isNil, isNotNil } from 'ramda';
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { getUIKey } from "@src/Utils";
import DummyTextField from "../DummyTextField";

const PropertiesGroupsSelector = forwardRef<AutocompleteProps<any, any, any, any, any>, ControllerRenderProps<FieldValues, string>>(({ value, onChange }, ref) => {
    const groups = useFetchExpress(`${process.env.NEXT_PUBLIC_API_URL!}/properties/groups/list.php`);
    const { validateResult } = useDataResponse();

    const options = useMemo(() => {
        const groupsData = validateResult(groups.result);
        if (isNotNil(groupsData)) {
            return groupsData;
        }
        return [];
    }, [groups.result, validateResult]);

    const selectedValue = useMemo(() => {
      if (options.length > 0) {
        return options.find((grp: FieldValues) => value === grp.id) || null
      }
      return null;
    } , [options, value]);

    if (groups.result && !groups.loading) {
      return (<Autocomplete
        disablePortal
        id="properties-groups"
        disabled={isNil(groups.result)}
        options={options}
        onChange={(e, val: any) => {
          onChange(val?.id || 0);
        }}
        value={selectedValue}
        ref={ref}
        renderOption={(props, option) => {
          return (
            <li {...props} key={getUIKey()}>
              {option.label}
            </li>
          );
        }}
        noOptionsText="El grupo no existe"
        loading={groups.loading}
        renderInput={(params) => <TextField {...params} name="groups" label="Grupo de Propiedades" fullWidth />}
        fullWidth
      />);
    }
    return <DummyTextField helperText={options.length === 0 ? "No hay grupos disponibles" : ""} error={true} />;
});

PropertiesGroupsSelector.displayName = 'PropertiesGroupsSelector';
export default PropertiesGroupsSelector;