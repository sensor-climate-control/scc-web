from main import TempFaker
from matplotlib import pyplot as plt
from datetime import date
from datetime import datetime
import matplotlib.dates as mdates
import matplotlib

def main():
    matplotlib.use("TkAgg")

    temp_faker = TempFaker(3)
    timestamps = [[] for _ in range(3)]
    temps = [[] for _ in range(3)]
    humidities = [[] for _ in range(3)]

    for _ in range(144*5):  # 144 readings for 24 hours with 10-minute intervals
        for i in range(3):
            fake_reading = temp_faker.fake(i)

            timestamps[i].append(fake_reading["date_time"])
            temps[i].append(fake_reading["temp_f"])
            humidities[i].append(fake_reading["humidity"])

    # Plot the temperature data
    plt.figure(figsize=(12, 6))

    for i in range(3):
        if i == 0:
            plt.plot(timestamps[i], temps[i], label=f"Temperature (#{i+1})", color="red")
        elif i == 1:
            plt.plot(timestamps[i], temps[i], label=f"Temperature (#{i+1})", color="green")
        elif i == 2:
            plt.plot(timestamps[i], temps[i], label=f"Temperature (#{i+1})", color="blue")


    plt.xlabel("Time")
    plt.ylabel("Temperature (°F)")
    plt.title("Temperature over 24 hours")
    plt.legend()
    plt.grid()
    plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%H:%M'))
    plt.show()

    # Plot the humidity data
    # plt.figure(figsize=(12, 6))
    # plt.plot(timestamps, humidities, label="Humidity", color="blue")
    # plt.xlabel("Time")
    # plt.ylabel("Humidity (%)")
    # plt.title("Humidity over 24 hours")
    # plt.legend()
    # plt.grid()
    # plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%H:%M'))
    # plt.show()

if __name__ == "__main__":
    main()