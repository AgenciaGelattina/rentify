import { Accordion, AccordionDetails, AccordionSummary, Chip, Typography } from "@mui/material";
import { ExpandMore, HomeWork, HolidayVillage } from '@mui/icons-material';

export type TPropertyDetails = {
    id: number;
    title: string;
    description: string;
    type: { id: number; label: string };
    group: { id: number; title: string };
    status: { id: number; label: string };
}

const PropertyDetails: React.FC<TPropertyDetails> = ({ id, title, description, type, group, status }) => {

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
          {group.id > 0 && <Chip icon={<HolidayVillage />} label={group.title} variant="outlined" />}
          <Chip label={type.label} variant="outlined" />
          <Chip label={status.label} variant="outlined" />
        </AccordionDetails>
    </Accordion>)
}

export default PropertyDetails;