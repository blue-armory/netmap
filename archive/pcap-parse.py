from scapy.all import *
from flask import Flask, jsonify
import pandas as pd
from ipaddress import ip_address



def packet_info(packet):
    return {
        "source_ip": packet['IP'].src,
        "destination_ip": packet['IP'].dst,
        "source_port": packet['TCP'].sport if 'TCP' in packet else None,
        "destination_port": packet['TCP'].dport if 'TCP' in packet else None
    }

def clean_network_data(network_data):
    """
    Clean the network_data dataframe.
    """
    # Replace null values
    network_data.fillna(value='', inplace=True)

    # Remove rows with any empty cells
    network_data.dropna(how='any', inplace=True)

    # Ensure IPs are valid
    network_data = network_data[network_data['source_ip'].apply(validate_ip)]
    network_data = network_data[network_data['destination_ip'].apply(validate_ip)]

    # Ensure ports are valid
    network_data = network_data[network_data['source_port'].apply(validate_port)]
    network_data = network_data[network_data['destination_port'].apply(validate_port)]

    return network_data

def validate_ip(ip):
    """
    Check if IP is valid.
    """
    try:
        ip_address(ip)
        return True
    except ValueError:
        return False

def validate_port(port):
    """
    Check if port is valid.
    """
    try:
        0 <= int(port) <= 65535
    except ValueError:
        pass

def process_pcap(pcapFile):
    """
    Process pcap file.
    """
    # Extract network data from pcap file
    network_data = extract_network_data(pcapFile)

    # Create DataFrame
    network_data_df = pd.DataFrame(network_data)

    # Clean network data
    cleaned_network_data_df = clean_network_data(network_data_df)

    # Check if cleaned data is empty
    if cleaned_network_data_df.empty:
        return {'status': 'error', 'message': 'No valid data found in pcap file.'}

    # Return cleaned data
    return {'status': 'success', 'data': cleaned_network_data_df.to_dict(orient='records')}

# Implement your function to extract network data
def extract_network_data(pcapFile):
    # ... your implementation ...
    packets = rdpcap(pcapFile)
    network_data = [packet_info(packet) for packet in packets if 'IP' in packet]

    return network_data
    # return jsonify({
    #     'pcap_file': pcapFile,
    #     'network_data': data
    #     })

# def packet_info(packet):
#     print("Source IP: ", packet[IP].src)
#     print("Destination IP: ", packet[IP].dst)
#     if TCP in packet:
#         print("Source Port: ", packet[TCP].sport)
#         print("Destination Port: ", packet[TCP].dport)
#     elif UDP in packet:
#         print("Source Port: ", packet[UDP].sport)
#         print("Destination Port: ", packet[UDP].dport)
#     print("\n")

def main():
    pcapFile = "resources\\2021-09-10-traffic-analysis-exercise.pcap"
    process_pcap(pcapFile)

if __name__ == "__main__":
    main()