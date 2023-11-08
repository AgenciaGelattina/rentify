import { forwardRef, useMemo } from "react";
import { useFetchExpress } from "@phoxer/react-components";
import { Autocomplete, AutocompleteProps, TextField } from "@mui/material";
import { isNil } from 'ramda';
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { getUIKey } from "@src/Utils";

const PropertiesGroupsSelector = forwardRef<AutocompleteProps<any, any, any, any, any>, ControllerRenderProps<FieldValues, string>>(({ value, onChange }, ref) => {
    const groups = useFetchExpress(`${process.env.NEXT_PUBLIC_API_URL!}/properties/groups/list.php`);

    const selectedValue = useMemo(() => {
      if (groups.result) {
        return groups.result.find((grp: FieldValues) => value === grp.id) || null
      }
      return null;
    } , [groups.result, value]);

    if (groups.result && !groups.loading) {
      return (<Autocomplete
        disablePortal
        id="properties-groups"
        disabled={isNil(groups.result)}
        options={groups.result || []}
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
    return null;
});

PropertiesGroupsSelector.displayName = 'PropertiesGroupsSelector';
export default PropertiesGroupsSelector;