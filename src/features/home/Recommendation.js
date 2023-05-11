import MyCard from "../application/MyCard"
import { CircularProgress } from "@mui/material";

const Recommendation = (props) => {
    const recommendations = props.recommendations
    const recommendationText = {
        heatIndexWarm: `To help warm your home to your desired temperature of ${props.preferences.temperature}, you should `,
        heatIndexCool: `To help cool your home to your desired temperature of ${props.preferences.temperature}, you should `,
        airQuality: "Due to poor air quality, you should ",
        smallTempDiff: "The indoor/outdoor temperature difference is small, so you can ",
        closed: "close your windows.",
        open: "open your windows.",
        none: "leave your windows as they are."
    }
    const futureTime = recommendations ? Math.ceil((recommendations.future.dt - Date.now()) / 3600000) : null

    const recommendationContent = (recommendations) ? (
        <div>
            <h5><u><b>Right Now:</b></u></h5>
            <p>{"" + recommendationText[recommendations.now.reason] + recommendationText[recommendations.now.rec]}</p>

            <h5><u><b>In {futureTime} hours:</b></u></h5>
            <p>{"" + recommendationText[recommendations.future.reason] + recommendationText[recommendations.future.rec]}</p>
        </div>
    ) : <CircularProgress />
    return (
        <MyCard title="Window Recommendations">
            {recommendationContent}
        </MyCard>
    )
} 

export default Recommendation