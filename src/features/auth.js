import MyCard from "./application/MyCard";
import { useGetAuthQuery } from './../reduxApi';

const CurrentAuth = () => {
    const { data, error, isLoading } = useGetAuthQuery();

    console.log("==== data: ", data)

    return (
        <MyCard title="Auth">
            {(isLoading || error) ? (<p>Loading...</p>) : (
                <div className="weather-stats-wrapper">
                    <p>User ID: {data.main.user_id}°F</p>
                    <p>ID Token: {data.main.id_token}°F</p>
                    <p>Access Token: {data.main.access_token}%</p>
                </div>
            )}
        </MyCard>
    )
}

export default CurrentAuth;
