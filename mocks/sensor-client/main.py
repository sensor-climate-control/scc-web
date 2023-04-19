import requests

BASE_URL = 'http://localhost:3001/api'
EMAIL = 'piperdaniel1@gmail.com'
PASSWORD = 'password'

def get_sensor_details(sensor_id, token):
    sensor_details_url = f"{BASE_URL}/sensors/{sensor_id}"

def create_sensor(home_id, token, name):
    create_sensor_url = f"{BASE_URL}/homes/{home_id}/sensors"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    payload = {
        "name": name,
        "active": True,
        "home": home_id,
        "location": "North",
    }

    response = requests.post(create_sensor_url, headers=headers, json=payload)

    if response.status_code == 201:
        return response.json()["id"]
    else:
        raise Exception(f"Failed to create sensor: {response}")

def get_home_info(home_id, token):
    home_info_url = f"{BASE_URL}/homes/{home_id}"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(home_info_url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to get home info: {response.json()['error']}")

def get_user_info(user_id, token):
    info_url = f"{BASE_URL}/users/{user_id}"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(info_url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to get user info: {response.json()['error']}")

def login():
    login_url = f"{BASE_URL}/users/login"
    payload = {
        "email": EMAIL,
        "password": PASSWORD
    }
    response = requests.post(login_url, json=payload)

    if response.status_code == 200:
        return response.json()["token"], response.json()["userid"]
    else:
        raise Exception(f"Login failed: {response.json()['error']}")

def main():
    token, userid = login()
    print(token, userid)
    user_info = get_user_info(userid, token)
    print(user_info)

    if not user_info["homes"]:
        raise Exception("Provided user has no homes, please create one in the app first.")
    
    # In theory the API only provides a homes array if the user has at least one home in the array
    try:
        home_id = user_info["homes"][0]
    except IndexError:
        raise Exception("Provided user has no homes, please create one in the app first.")
    
    home_info = get_home_info(home_id, token)
    print(home_info)

    while True:
        print(" == LOGIN SUCCESSFUL == ")
        print("Authenticated as user:", user_info["name"])
        print("Home name:", home_info["name"])

        # Check if the home has any sensors
        HAS_SENSORS = True
        try:
            home_info["sensors"]
        except KeyError:
            HAS_SENSORS = False

        if HAS_SENSORS:
            sensors = []
            print("This home has the following sensors: ", home_info["sensors"])
        else:
            print("This home has no sensors yet.")

        choice = input("You can start sending mock readings (1) or create a new sensor (2): ")

        if choice == "1":
            if not HAS_SENSORS:
                print("Sorry, you can't send readings if there are no sensors. Please create a sensor first.")
                continue
        elif choice == "2":
            while True:
                sensor_name = input("Please enter a name for the sensor: ")
                create_sensor(home_id, token, sensor_name)

                choice = input("Would you like to create another sensor (y/n): ")
                if choice.lower() == "n":
                    print("Done creating sensors. Exiting...")
                    break
        else:
            print("Sorry, please enter either 1 or 2.")

if __name__ == '__main__':
    main()