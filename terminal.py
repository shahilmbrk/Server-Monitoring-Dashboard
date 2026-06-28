import psutil
import os,time
from colorama import Fore, Style, init
from datetime import datetime
from monitor import (
    get_cpu,
    get_memory,
    disk_usage,
    uptime,
    network,
    progress_bar,
    byte_to_gb,
    status_check
)
init(autoreset=True)


def main():

    cpu,cpu_count,cpu_freq = get_cpu()
    memory = get_memory()
    disk = disk_usage()
    days,hours,minute,seconds=uptime()
    sent,recv=network()

    print("="*30)
    print("SERVER MONITORING DASHBOARD")
    print("="*30)
    print("Time: ",datetime.now().strftime("%H:%M:%S"))
    print()


    print("CPU Info :\t")
    print(f" CPU Usage:\n {progress_bar(cpu)}",f"{cpu}% \n CPU Cores: {cpu_count},\n CPU Frequency: {cpu_freq.current/1000} Ghz")
    status_check(cpu)

    print("System Uptime :")
    print(f" Days : {days},\n Hours : {hours},\n minutes: {minute},\n Seconds: {seconds}\n")

    print(f"RAM Usage:")
    print(progress_bar(memory),f"{memory}%")
    status_check(memory)

    print(f"DISK Usage:")
    print(progress_bar(disk),f"{disk}%")
    status_check(disk)
    print("Network Details:")
    print(f" Bytes Sent: {byte_to_gb(sent)} GB")
    print(f" Bytes Received: {byte_to_gb(recv)} GB")

if __name__ == "__main__":
    while True:
        os.system("cls")
        main()
        time.sleep(10)
