import { FC } from "react";
import { IBinnacle } from "../Binnacle";

interface IBinnacleFormProps {
    binnacle?: IBinnacle;
}

const BinnacleForm: FC<IBinnacleFormProps> = () => {

    return (
        <div>
            <h1>Binnacle Form</h1>
        </div>
    );
};

export default BinnacleForm;