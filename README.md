# netmap
Network Exploration and Topology MAPping tool


## Quick Start
1. python3 app.py
2. node server.js

Network_Data API Hosted: http://localhost:5000/network_data
Visualization Hosted: http://localhost:3000

### Note

```javascript
"<script src="/network.js"></script>"
```   
In index.html switch the above line (20) to network-port.js to get a unique source -> target port view

Also, zooming should work properly if hovering over the SVG on the page

## Requirements
### Python
scapy: pip install scapy
flask: pip install flask
flask-cors: pip install -U flask-cors // To fix API being able to talk (Cross-Origin Resource Sharing)

### Javascript
d3: npm install express d3

### Binaries
Npcap: https://nmap.org/npcap/