import MyCard from "./application/MyCard";

const Logout = () => {

    return (
        <MyCard>
            <button>
                <a href="/.auth/logout">Sign out</a>
            </button>
        </MyCard>
    )
}

export default Logout;