import requests
import time as clock
import random
from datetime import time
from datetime import datetime, date, timedelta
import math

BASE_URL = 'http://localhost:3001/api'
EMAIL = 'piperdaniel1@gmail.com'
PASSWORD = 'password'

class TempFaker:
    def __init__(self, start_temp=70, start_humidity=50, temp_range=15, humidity_range=30, start_time: time = time(0, 0), interval = 5, max_deviation = 5):
        self.base_temp = start_temp
        self.base_humidity = start_humidity
        self.temp_range = temp_range
        self.humidity_range = humidity_range
        self.deviation = 0
        self.max_deviation = max_deviation
        self.time = start_time
        self.interval = interval

    def fake(self):
        # Calculate the time of day as a fraction of 24 hours (0-1)
        time_fraction = (self.time.hour * 60 + self.time.minute) / (24 * 60)

        # Generate a sine wave pattern for temperature and humidity
        temp_wave = self.temp_range * ((1 + math.sin(math.pi * time_fraction)) / 2)
        humidity_wave = self.humidity_range * ((1 + math.sin(math.pi * time_fraction)) / 2)

        self.deviation += random.uniform(-0.2, 0.2)
        self.deviation = max(-self.max_deviation, min(self.deviation, self.max_deviation))
        
        # Add some random noise to the readings
        temp_noise = random.uniform(-0.25, 0.25)
        humidity_noise = random.uniform(-0.25, 0.25)

        # Calculate the final temperature and humidity
        temp = self.base_temp + temp_wave + temp_noise + self.deviation
        humidity = self.base_humidity + humidity_wave + humidity_noise + self.deviation

        # Advance the time by self.interval minutes
        self.time = (datetime.combine(date.today(), self.time) + timedelta(minutes=self.interval)).time()

        return temp, humidity

def send_reading(sensor_id, home_id, token, temp_f, humidity):
    reading_send_url = f"{BASE_URL}/homes/{home_id}/sensors/{sensor_id}/readings"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    payload = [{
        "date_time": clock.time(),
        "temp_f": temp_f,
        "temp_c": temp_f - 32 * 5/9,
        "humidity": humidity,
    }]

    response = requests.post(reading_send_url, headers=headers, json=payload)

    if response.status_code == 201:
        return response.json()
    else:
        raise Exception(f"Failed to send reading: {response.json()['error']}")

def get_sensor_details(sensor_id, home_id, token):
    sensor_details_url = f"{BASE_URL}/homes/{home_id}/sensors/{sensor_id}"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(sensor_details_url, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to get sensor details: {response.json()['error']}")


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
        print("\n == LOGIN SUCCESSFUL == ")
        print("Authenticated as user:", user_info["name"])
        print("Home name:", home_info["name"])

        # Check if the home has any sensors
        HAS_SENSORS = True
        try:
            home_info["sensors"]
        except KeyError:
            HAS_SENSORS = False

        if HAS_SENSORS:
            sensors = [get_sensor_details(sensor_id, home_id, token) for sensor_id in home_info["sensors"]]
            sensor_names = [sensor["name"] for sensor in sensors]

            print("This home has the following sensors: ", sensor_names)
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