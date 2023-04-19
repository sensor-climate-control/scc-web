from main import TempFaker
from matplotlib import pyplot as plt
from datetime import date
from datetime import datetime
import matplotlib.dates as mdates
import matplotlib

def main():
    matplotlib.use("TkAgg")

    temp_faker = TempFaker()
    timestamps = []
    temps = []
    humidities = []

    common_date = date.today()

    for _ in range(144):  # 144 readings for 24 hours with 10-minute intervals
        temp, humidity = temp_faker.fake()
        timestamp = datetime.combine(common_date, temp_faker.time)
        timestamps.append(timestamp)
        temps.append(temp)
        humidities.append(humidity)

    # Plot the temperature data
    plt.figure(figsize=(12, 6))
    plt.plot(timestamps, temps, label="Temperature", color="red")
    plt.xlabel("Time")
    plt.ylabel("Temperature (°F)")
    plt.title("Temperature over 24 hours")
    plt.legend()
    plt.grid()
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%H:%M'))
    plt.show()

    # Plot the humidity data
    plt.figure(figsize=(12, 6))
    plt.plot(timestamps, humidities, label="Humidity", color="blue")
    plt.xlabel("Time")
    plt.ylabel("Humidity (%)")
    plt.title("Humidity over 24 hours")
    plt.legend()
    plt.grid()
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%H:%M'))
    plt.show()

if __name__ == "__main__":
    main()