import { Accordion, AccordionDetails, AccordionSummary, Chip, Typography } from "@mui/material";
import { ExpandMore, HomeWork, HolidayVillage } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import LabelTextBox from "@src/Components/LabelTextBox";
import { ConditionalRender } from "@phoxer/react-components";
import { IRole } from "@src/DataProvider/interfaces";

export interface IProperty {
    id: number;
    title: string;
    description: string;
    type: { id: number; label: string };
    group: { id: number; title: string, description: string };
    assignment: IPropertyAssignment | null;
    status: { id: number; label: string };
    active_contract: number | null;
    active: boolean;
};

export interface IPropertyAssignment {
  id: number;
  name: string;
  surname: string;
  role: IRole;
};

interface IPropertyDetailsProps {
  property: IProperty;
};

const PropertyDetails: React.FC<IPropertyDetailsProps> = ({ property }) => {
    const { id, title, description, type, group, status, assignment } = property;
    return (<Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          id="property"
        >
          <HomeWork sx={{ marginRight: '.7rem '}} />
          <Typography variant="h6">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" gutterBottom>{description}</Typography>
          {(group.id > 0) && <LabelTextBox title="Grupo:" text={group.title} />}
          {assignment && <LabelTextBox title={assignment.role.label} text={`${assignment.name} ${assignment.surname}`} />}
          <LabelTextBox title="Tipo de Propiedad:" text={type.label} />
          <LabelTextBox title="Estado de la Propiedad:" text={status.label} />
        </AccordionDetails>
    </Accordion>)
}

export default PropertyDetails;