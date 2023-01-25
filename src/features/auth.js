import MyCard from "./application/MyCard";
import { useGetAuthQuery } from '../reduxApi';

const CurrentAuth = () => {
    const { data, error, isLoading } = useGetAuthQuery();

    console.log("==== data: ", data)

    return (
        <MyCard title="Auth">
            {(isLoading || error) ? (<p>Loading...</p>) : (
                <div className="weather-stats-wrapper">
                    <p>User ID: {data[0].user_id}</p>
                    <p>ID Token: {data[0].id_token}</p>
                    <p>Access Token: {data[0].access_token}</p>
                </div>
            )}
        </MyCard>
    )
}

export default CurrentAuth;
