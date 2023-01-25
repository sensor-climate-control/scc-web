import MyCard from "./application/MyCard";

const Login = () => {

    return (
        <MyCard>
            <button>
                <a href="/.auth/login/aad?post_login_redirect_uri=/">Log in with the Microsoft Identity Platform</a>
            </button>
        </MyCard>
    )
}

export default Login;
