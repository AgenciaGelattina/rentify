import { Accordion, AccordionDetails, AccordionSummary, Chip, Typography } from "@mui/material";
import { ExpandMore, HomeWork, HolidayVillage } from '@mui/icons-material';
import Grid from '@mui/material/Grid2';
import LabelTextBox from "@src/Components/LabelTextBox";
import { ConditionalRender } from "@phoxer/react-components";

export interface IProperty {
    id: number;
    title: string;
    description: string;
    type: { id: number; label: string };
    group: { id: number; title: string, description: string };
    status: { id: number; label: string };
    active_contract: number | null;
    active: boolean;
}

interface IPropertyDetailsProps {
  property: IProperty;
}

const PropertyDetails: React.FC<IPropertyDetailsProps> = ({ property }) => {
    const { id, title, description, type, group, status } = property;
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
          <ConditionalRender condition={(group.id > 0)}>
            <LabelTextBox title="Grupo:" text={group.title} />
          </ConditionalRender>
          <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LabelTextBox title="Tipo de Propiedad:" text={type.label} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LabelTextBox title="Estado de la Propiedad:" text={status.label} />
              </Grid>
          </Grid>
        </AccordionDetails>
    </Accordion>)
}

export default PropertyDetails;