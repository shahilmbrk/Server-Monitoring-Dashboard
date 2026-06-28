import psutil,time
from colorama import Fore, Style, init
from datetime import datetime

def get_cpu():

    cpu = psutil.cpu_percent(interval=1)
    cpu_count=psutil.cpu_count()
    cpu_freq=psutil.cpu_freq()
    return cpu,cpu_count,cpu_freq

    
def uptime():
    current_time = datetime.now().timestamp()
    uptime_seconds = current_time - psutil.boot_time()
    days=int(uptime_seconds//86400)
    remain_sec=uptime_seconds%86400
    hours=int(remain_sec//3600)
    remain_sec=remain_sec%3600
    minute=int(remain_sec//60)
    seconds=int(remain_sec%60)
    return days,hours,minute,seconds
    
def get_memory():
    memory = psutil.virtual_memory()

    total=byte_to_gb(memory.total)
    used=byte_to_gb(memory.used)
    available=byte_to_gb(memory.available)
    return memory.percent,total,used,available

def disk_usage():
    disk= psutil.disk_usage("/")
    total=byte_to_gb(disk.total)
    used=byte_to_gb(disk.used)
    free=byte_to_gb(disk.free)
    return disk.percent,total,used,free

def network():
    size_sent=psutil.net_io_counters().bytes_sent
    size_recv=psutil.net_io_counters().bytes_recv
    
    return size_sent,size_recv


def progress_bar(percentage):
    bar_length=20
    filled=round(bar_length*percentage/100)
    empty=bar_length-filled
    if percentage>75:
        return Fore.RED+"█"*filled+"░"*empty
    elif percentage>40:
        return Fore.YELLOW+"█"*filled+"░"*empty
    else:
        return Fore.GREEN+"█"*filled+"░"*empty
    
def get_color(value):

    if value > 75:
        return "#ff4444"      #red

    elif value > 40:
        return "#ffb400"      #yellow

    else:
        return "#00d9ff"      #blue 

def byte_to_gb(value):
    return round(value/(1024**3),2)

def status_check(value):
    if value>75:
        print("HIGH USAGE !!!\n")
    elif value>40:
        print("MEDIUM Usage !!\n")
    else:
        print("Low usage !\n")

def top_process():
    processes = []

    # First sample (initialize CPU counters)
    for process in psutil.process_iter():
        try:
            process.cpu_percent(None)
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

    # Small delay to measure CPU usage
    time.sleep(0.1)

    # Second sample (actual values)
    for process in psutil.process_iter(['name', 'memory_percent']):
        if process.info["name"] == "System Idle Process":
            continue
        try:
            processes.append({
                "name": process.info['name'],
                "cpu": round(process.cpu_percent(None), 2),
                "memory": round(process.memory_info().rss / (1024 ** 2), 2)
            })

        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass

    processes = sorted(
        processes,
        key=lambda p: p["cpu"],
        reverse=True
    )

    return processes[:5]