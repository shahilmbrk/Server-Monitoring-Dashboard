from flask import Flask,render_template
import monitor

app = Flask(__name__)
@app.route("/")
def home():
    cpu, cpu_count, cpu_freq = monitor.get_cpu()
    cpu_color=monitor.get_color(cpu)
    memory,total_r,used_r,available_r = monitor.get_memory()
    disk,total_d,used_d,free_d = monitor.disk_usage()
    days, hours, minutes, seconds = monitor.uptime()
    sent,recv=monitor.network()
    processes=monitor.top_process()
    return render_template(
        "index.html",
        cpu=cpu,
        cpu_count=cpu_count,
        cpu_freq=round(cpu_freq.current / 1000, 2),
        bar_color=cpu_color,
        memory=memory,
        used_ram=used_r,
        total_ram=total_r,
        available_ram=available_r,
        disk=disk,
        total_disk=total_d,
        used_disk=used_d,
        free_disk=free_d,
        days=days,
        hours=hours,
        minutes=minutes,
        seconds=seconds,
        sent=monitor.byte_to_gb(sent),
        recv=monitor.byte_to_gb(recv),
        processes=processes
    )

if __name__=="__main__":
    app.run(debug=True)