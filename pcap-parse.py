from scapy.all import *

def packet_info(packet):
    print("Source IP: ", packet[IP].src)
    print("Destination IP: ", packet[IP].dst)
    if TCP in packet:
        print("Source Port: ", packet[TCP].sport)
        print("Destination Port: ", packet[TCP].dport)
    elif UDP in packet:
        print("Source Port: ", packet[UDP].sport)
        print("Destination Port: ", packet[UDP].dport)
    print("\n")

def main():
    pcap_file = "HTTP-NTLM.pcap"
    packets = rdpcap(pcap_file)
    for packet in packets:
        if IP in packet:
            packet_info(packet)

if __name__ == "__main__":
    main()