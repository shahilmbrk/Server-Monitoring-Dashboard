function getColor(value) {

    if (value > 70)
        return "#ff4d4d";      // Red

    else if (value > 40)
        return "#ffcc00";      // Yellow

    return "#00d9ff";          // Cyan
}

function updateDashboard() {

    fetch("/api/stats")
        .then(response => response.json())
        .then(data => {
            document.getElementById("cpu-value").textContent = data.cpu + "%";
            let cpuBar = document.getElementById("cpu-bar");
            cpuBar.style.width = data.cpu + "%";
            cpuBar.style.backgroundColor = getColor(data.cpu);
            document.getElementById("cpu-freq").textContent = "Frequency: " + data.cpu_freq + " GHz";

            document.getElementById("memory-value").textContent = data.memory + "%";
            let ramBar = document.getElementById("memory-bar");
            ramBar.style.width = data.memory + "%";
            ramBar.style.backgroundColor = getColor(data.memory);
            document.getElementById("memory-total").textContent = "Total: " + data.total_ram + " GB";
            document.getElementById("memory-used").textContent = "Used: " + data.used_ram + " GB";
            document.getElementById("memory-free").textContent = "Available: " + data.available_ram + " GB";

            document.getElementById("disk-value").textContent = data.disk + "%";
            let diskBar = document.getElementById("disk-bar");
            diskBar.style.width = data.disk + "%";
            diskBar.style.backgroundColor = getColor(data.disk);
            document.getElementById("disk-total").textContent = "Total: " + data.total_disk + " GB";
            document.getElementById("disk-used").textContent = "Used: " + data.used_disk + " GB";
            document.getElementById("disk-free").textContent = "Available: " + data.free_disk + " GB";

            document.getElementById("sent-value").textContent = "Sent: " + data.sent + " GB";
            document.getElementById("recv-value").textContent = "Received: " + data.recv + " GB";
            document.getElementById("days").textContent = data.days + " Days";
            document.getElementById("hours").textContent = data.hours + " Hours";
            document.getElementById("minutes").textContent = data.minutes + " Minutes";
            document.getElementById("seconds").textContent = data.seconds + " Seconds";
            let html = "";

            for (let process of data.processes) {

                html += `
                <tr>
                    <td>${process.name}</td>
                    <td>${process.cpu}%</td>
                    <td>${process.memory} MB</td>
                </tr>
                `;

            }

            document.getElementById("processes").innerHTML = html;
        });

}

updateDashboard();
setInterval(updateDashboard, 2000);