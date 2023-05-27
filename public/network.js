export function runNetwork() {
    d3.select("svg").remove();
    var div = d3.select("#network-map");
    var width = parseInt(div.style("width"));
    var height = parseInt(div.style("height"));

    var svg = d3.select("#network-map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var g = svg.append("g");

    var zoom = d3.zoom()
        .scaleExtent([-10, 10]) // Zoom limits
        .on("zoom", function(event) {
        g.attr("transform", event.transform);
        });
    
    svg.call(zoom);
    console.log('About to fetch data...');
    fetch('http://localhost:5000/network_data')
        .then(response => response.json())
        .then(data => {
            var pcapFile = data.pcap_file; // Extract pcap file name
            document.getElementById('pcap-file').innerText = `Pcap File: ${pcapFile}`; // Display pcap file name
            var networkDataArray = data.network_data; // Get network data
            var nodes = [...new Set(networkDataArray.flatMap(e => [e.source_ip, e.destination_ip]))].map(ip => ({id: ip}));
            var links = networkDataArray.map(e => ({source: nodes.find(n => n.id === e.source_ip), target: nodes.find(n => n.id === e.destination_ip)}));
            var networkData = {
                nodes: nodes,
                links: links
            };

            var simulation = d3.forceSimulation(networkData.nodes)
                .force("link", d3.forceLink(networkData.links).distance(200))
                .force("charge", d3.forceManyBody().strength(-500))
                .force("center", d3.forceCenter(width / 2, height / 2));

            var link = g.append("g")
                .selectAll("line")
                .data(networkData.links)
                .join("line")
                .attr("class", "link");

            var node = g.append("g")
                .selectAll("circle")
                .data(networkData.nodes)
                .join("circle")
                .attr("class", "node")
                .attr("r", 20)
                .attr("fill", "blue")
                .call(drag(simulation));

            var labels = g.append("g")
                .selectAll("text")
                .data(networkData.nodes)
                .join("text")
                .text(d => d.id)
                .attr("x", d => d.x)
                .attr("y", d => d.y)
                .attr("dy", "-1.5em") // Shift the text up
                .style("text-anchor", "middle");

            node.append("title")
                .text(d => d.id);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        
        labels
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    function drag(simulation) {

        function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
        }

        function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
        }

        function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
        }

        return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }
    })
    .catch(error => console.error('Error:', error));
    console.log('Data fetched, processing...');
}