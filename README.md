# netmap
Network Exploration and Topology MAPping tool

TODO: 
- After reading https://apps.dtic.mil/sti/pdfs/AD1021455.pdf, need to adjust the main view to be as simple as possible, just layer 3 connections overview.  
- Remove/alter port view in favor of a more lens/query focused views. Could possibly use hover text boxes and line density to convey information, but less is better.
- Display a table alongside the graphical display with filters/sorting to sift through info
- Add a feature for "Scheme of Maneuver modeling", which is a significanly different tool, but still tangentially related

## Quick Start
### API
1. python3 app.py

## Web UI
1. npm install express d3
2. node server.js

Network_Data API Hosted: http://localhost:5000/network_data  
Visualization Hosted: http://localhost:3000

## Usage  
![Usage](usage.gif)

TODO: Outdated gif, need to redo

## Requirements
### Python
scapy: pip install scapy
flask: pip install flask
flask-cors: pip install -U flask-cors // To fix API being able to talk (Cross-Origin Resource Sharing)

### Javascript
d3: npm install express d3

### Binaries
Npcap: https://nmap.org/npcap/
