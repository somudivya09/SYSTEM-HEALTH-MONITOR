from flask import Flask, render_template, jsonify
import psutil

app = Flask(__name__)

def get_status(cpu, memory):
    if cpu > 85 or memory > 85:
        return "CRITICAL"
    elif cpu > 60 or memory > 60:
        return "MODERATE"
    else:
        return "HEALTHY"

def get_recommendations(cpu, memory):
    rec=[]

    if cpu>80:
        rec.append("High CPU usage detected")

    if memory>80:
        rec.append("Memory usage is high")

    if not rec:
        rec.append("System operating within safe limits")

    return rec


def get_top_processes():

    processes=[]

    for p in psutil.process_iter(['name','cpu_percent']):
        try:
            processes.append(p.info)
        except:
            pass

    processes=sorted(processes,key=lambda x:x['cpu_percent'],reverse=True)

    return processes[:5]


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/metrics")
def metrics():

    cpu=psutil.cpu_percent(interval=1)
    memory=psutil.virtual_memory().percent
    disk=psutil.disk_usage('/').percent

    net=psutil.net_io_counters()

    network=round((net.bytes_sent + net.bytes_recv)/1024/1024,2)  
    # MB transferred

    data={

        "cpu":cpu,
        "memory":memory,
        "disk":disk,
        "network":network,
        "status":get_status(cpu,memory),
        "processes":get_top_processes(),
        "recommendations":get_recommendations(cpu,memory)

    }

    return jsonify(data)


if __name__=="__main__":
    app.run(debug=True)