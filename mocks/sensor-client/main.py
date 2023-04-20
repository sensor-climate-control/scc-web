import requests
import time as clock
import random
from datetime import time
from datetime import datetime, date, timedelta
import math
from progress.bar import ChargingBar

BASE_URL = 'http://localhost:3001/api'
EMAIL = 'piperdaniel1@gmail.com'
PASSWORD = 'password'

class TempFaker:
    def __init__(self, num_sensors, max_sensor_dev = 0.5, max_sensor_hr_offset=1.5, start_temp=70, start_humidity=50, temp_range=20, humidity_range=30, start_time: datetime = datetime.now(), interval = 5, max_deviation = 5):
        self.base_temp = start_temp
        self.base_humidity = start_humidity
        self.temp_range = temp_range
        self.humidity_range = humidity_range
        self.deviation = 0
        self.max_deviation = max_deviation
        self.time = start_time
        self.interval = interval

        self.sensor_deviations = [random.uniform(-max_sensor_dev, max_sensor_dev) for _ in range(num_sensors)]
        self.sensor_hr_offset = [random.uniform(-max_sensor_hr_offset, max_sensor_hr_offset) for _ in range(num_sensors)]
        self.max_sensor_dev = 5

    def fake(self, sensor_ind = 0):
        # Calculate the time of day as a fraction of 24 hours (0-1)
        adj_hour = self.time.hour - 5 + self.sensor_hr_offset[sensor_ind]
        if adj_hour < 0:
            adj_hour += 24
        time_fraction = (adj_hour * 60 + self.time.minute) / (24 * 60)

        # Generate a sine wave pattern for temperature and humidity
        temp_wave = self.temp_range * ((1 + math.sin(math.pi * time_fraction)) / 2)
        humidity_wave = self.humidity_range * ((1 + math.sin(math.pi * time_fraction)) / 2)

        self.deviation += random.uniform(-0.2, 0.2)
        self.deviation = max(-self.max_deviation, min(self.deviation, self.max_deviation))

        self.sensor_deviations[sensor_ind] += random.uniform(-0.05, 0.05)
        self.sensor_deviations[sensor_ind] = max(-self.max_sensor_dev, min(self.sensor_deviations[sensor_ind], self.max_sensor_dev))

        # Add some random noise to the readings
        temp_noise = random.uniform(-0.25, 0.25)
        humidity_noise = random.uniform(-0.25, 0.25)

        # Calculate the final temperature and humidity
        temp = self.base_temp + temp_wave + temp_noise + self.deviation + self.sensor_deviations[sensor_ind]
        humidity = self.base_humidity + humidity_wave + humidity_noise + self.deviation + self.sensor_deviations[sensor_ind]

        fake_reading = {"date_time": self.time,
                        "temp_f": temp, 
                        "temp_c": (temp - 32) * 5/9, 
                        "humidity": humidity}

        # Advance the time by self.interval minutes
        self.time += timedelta(minutes=self.interval)

        return fake_reading


def send_reading(sensor_id, home_id, token, reading):
    reading_send_url = f"{BASE_URL}/homes/{home_id}/sensors/{sensor_id}/readings"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    reading["date_time"] = clock.mktime(reading["date_time"].timetuple())

    payload = [reading]

    response = requests.put(reading_send_url, headers=headers, json=payload)

    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to send reading: {response.json()['error']}")

def send_readings(sensor_id, home_id, token, readings):
    reading_send_url = f"{BASE_URL}/homes/{home_id}/sensors/{sensor_id}/readings"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    for i in range(len(readings)):
        readings[i]["date_time"] = clock.mktime(readings[i]["date_time"].timetuple())

    response = requests.put(reading_send_url, headers=headers, json=readings)

    if response.status_code == 200:
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

def delete_sensor(sensor_id, home_id, token):
    delete_sensor_url = f"{BASE_URL}/homes/{home_id}/sensors/{sensor_id}"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.delete(delete_sensor_url, headers=headers)

    if response.status_code == 204:
        return
    else:
        raise Exception(f"Failed to delete sensor: {response.json()}")


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
    

def send_batch_data(token, userid, sensors, home_info):
    offset = 0
    while True:
        choice = input("Okay. Enter the number of days to offset the batch by (be careful to not overlap with current readings).\nThe batch will start at this number of days back and march forward: ")

        try:
            offset = float(choice)
            break
        except ValueError:
            print("Sorry, enter a number please!")
    
    days = 0
    while True:
        choice = input("Nice. How many days of data do you want to fill? Must be an integer: ")

        try:
            days = int(choice)
            break
        except ValueError:
            print("Sorry, enter an integer please!")
    
    interval = 0
    while True:
        choice = input("Alright. How many minutes should be in between each reading? Must be int: ")

        try:
            interval = int(choice)
            break
        except ValueError:
            print("Sorry, enter an integer please!")
    
    id = -1
    choice = input("Almost there. Enter a specific sensor to target (or hit ENTER to target all): ")
    try:
        id = int(choice)
    except ValueError:
        pass
    
    faker = TempFaker(num_sensors=len(sensors), interval=interval, start_time=datetime.now() - timedelta(offset))

    minutes_to_fill = days * 24 * 60    

    iters = round(minutes_to_fill / interval)
    
    bar = ChargingBar('Sending Readings', max=iters)
    readings_arrs = [[] for i in range(len(sensors))]
    for prog in range(iters):
        bar.next()
        if id == -1:
            for i in range(len(sensors)):
                reading = faker.fake(i)
                readings_arrs[i].append(reading)
        else:
            reading = faker.fake(id)
            readings_arrs[id].append(reading)

    for i in range(len(sensors)):
        if len(readings_arrs[i]) > 0:
            send_readings(sensors[i]["_id"], sensors[i]["home"], token, readings_arrs[i])
    bar.finish()

def stream_live_data(token, userid, sensors, home_info):
    raise NotImplementedError("Streaming live data is not yet implemented.")

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
    

    while True:
        home_info = get_home_info(home_id, token)
        print(home_info)

        print("\n == LOGIN SUCCESSFUL == ")
        print("Authenticated as user:", user_info["name"])
        print("Home name:", home_info["name"])

        # Check if the home has any sensors
        HAS_SENSORS = True
        try:
            home_info["sensors"]
        except KeyError:
            HAS_SENSORS = False
        
        sensors = []
        sensor_names = []

        if HAS_SENSORS:
            sensors = [get_sensor_details(sensor_id, home_id, token) for sensor_id in home_info["sensors"]]
            sensor_names = [sensor["name"] for sensor in sensors]

            print("This home has the following sensors: ", sensor_names)
        else:
            print("This home has no sensors yet.")

        choice = input("You can start sending mock readings (1), create a new sensor (2), or delete all sensors (3): ")

        if choice == "1":
            if not HAS_SENSORS:
                print("Sorry, you can't send readings if there are no sensors. Please create a sensor first.")
                continue

            choice = input("Alright, you can either send a day long batch of data (1) or stream data live (2)")

            if choice == "1":
                send_batch_data(token, userid, sensors, home_info)
            elif choice == "2":
                stream_live_data(token, userid, sensors, home_info)
            
        elif choice == "2":
            while True:
                sensor_name = input("Please enter a name for the sensor: ")
                create_sensor(home_id, token, sensor_name)

                choice = input("Would you like to create another sensor (y/n): ")
                if choice.lower() == "n":
                    print("Done creating sensors. Exiting...")
                    break
        
        elif choice == "3":
            if not HAS_SENSORS:
                print("Sorry, you can't delete sensors if there are no sensors. Please create a sensor first.")
                continue
                
            for sensor in sensors:
                print("Deleting sensor: ", sensor["name"])
                delete_sensor(sensor["_id"], sensor["home"], token)
        else:
            print("Sorry, please enter either 1 or 2.")

if __name__ == '__main__':
    main()