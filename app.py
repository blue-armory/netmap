from flask import Flask, jsonify
from flask_cors import CORS
from scapy.all import *

app = Flask(__name__)
CORS(app)

def packet_info(packet):
    return {
        "source_ip": packet[IP].src,
        "destination_ip": packet[IP].dst,
        "source_port": packet[TCP].sport if TCP in packet else None,
        "destination_port": packet[TCP].dport if TCP in packet else None
    }

@app.route('/network_data', methods=['GET'])
def get_network_data():
    pcap_file = "resources\\2021-09-10-traffic-analysis-exercise.pcap" 
    packets = rdpcap(pcap_file)
    data = [packet_info(packet) for packet in packets if IP in packet]

    return jsonify({
        'pcap_file': pcap_file,
        'network_data': data
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)