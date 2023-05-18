import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material"
import { useDeleteSensorMutation } from "../../reduxApi";

function RemoveSensor(props) {
    const [triggerDeleteSensor] = useDeleteSensorMutation()
    async function handleDeleteSensor(e) {
        e.preventDefault();

        const response = await triggerDeleteSensor({
            home_id: props.homeid,
            sensor_id: props.sensorid
        })
        console.log("==== deleteSensorResponse: ", response)
    }

    return (
        <IconButton aria-label="delete" onClick={(e) => handleDeleteSensor(e)}>
            <Delete />
        </IconButton>
    )
}

export default RemoveSensor