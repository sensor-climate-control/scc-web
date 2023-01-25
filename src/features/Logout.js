import MyCard from "./application/MyCard";

const Logout = () => {

    return (
        <MyCard>
            <button>
                <a href="/.auth/logout?post_logout_redirect_uri=/">Sign out</a>
            </button>
        </MyCard>
    )
}

export default Logout;