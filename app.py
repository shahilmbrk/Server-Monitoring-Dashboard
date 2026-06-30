from flask import Flask,render_template
import monitor

app = Flask(__name__)
def get_dashboard_data():
    cpu, cpu_count, cpu_freq = monitor.get_cpu()
    cpu_color=monitor.get_color(cpu)
    memory,total_r,used_r,available_r = monitor.get_memory()
    memory_color=monitor.get_color(memory)
    disk,total_d,used_d,free_d = monitor.disk_usage()
    disk_color=monitor.get_color(disk)
    days, hours, minutes, seconds = monitor.uptime()
    sent,recv=monitor.network()
    processes=monitor.top_process()
    return {
        "cpu": cpu,
        "cpu_count": cpu_count,
        "cpu_freq": round(cpu_freq.current / 1000, 2),
        "cpu_color": cpu_color,

        "memory": memory,
        "memory_color":memory_color,
        "total_ram": total_r,
        "used_ram": used_r,
        "available_ram": available_r,

        "disk": disk,
        "disk_color":disk_color,
        "total_disk": total_d,
        "used_disk": used_d,
        "free_disk": free_d,

        "days": days,
        "hours": hours,
        "minutes": minutes,
        "seconds": seconds,

        "sent": sent,
        "recv": recv,

        "processes": processes
    }
@app.route("/")
def home():
    data = get_dashboard_data()
    return render_template(
        "index.html",
        cpu=data["cpu"],
        cpu_count=data["cpu_count"],
        cpu_freq=data["cpu_freq"],
        cpu_color=data["cpu_color"],
        memory=data["memory"],
        memory_color=data["memory_color"],
        used_ram=data["used_ram"],
        total_ram=data["total_ram"],
        available_ram=data["available_ram"],
        disk=data["disk"],
        disk_color=data["disk_color"],
        total_disk=data["total_disk"],
        used_disk=data["used_disk"],
        free_disk=data["free_disk"],
        days=data["days"],
        hours=data["hours"],
        minutes=data["minutes"],
        seconds=data["seconds"],
        sent=data["sent"],
        recv=data["recv"],
        processes=data["processes"]
    )

@app.route("/api/stats")
def api_stats():
    return get_dashboard_data()

if __name__=="__main__":
    app.run(debug=True)