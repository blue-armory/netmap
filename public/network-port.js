export function runNetworkPort() {
    d3.select("svg").remove();
    var width = 1500;
    var height = 900;

    var svg = d3.select("body")
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

    fetch('http://localhost:5000/network_data')
        .then(response => response.json())
        .then(data => {
        var pcapFile = data.pcap_file;

        document.getElementById('pcap-file').innerText = `Pcap File: ${pcapFile}`;

        var networkDataArray = data.network_data;

        var nodes = [...new Set(networkDataArray.flatMap(e => [`${e.source_ip}:${e.source_port}`, `${e.destination_ip}:${e.destination_port}`]))].map(ip_port => ({id: ip_port}));

        var links = networkDataArray.map(e => ({source: nodes.find(n => n.id === `${e.source_ip}:${e.source_port}`), target: nodes.find(n => n.id === `${e.destination_ip}:${e.destination_port}`)}));

        var uniqueLinks = [];
        links.forEach(link => {
        if (!uniqueLinks.find(l => (l.source === link.source && l.target === link.target) || (l.source === link.target && l.target === link.source))) {
            uniqueLinks.push(link);
        }
        });

        var simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).distance(200))
            .force("charge", d3.forceManyBody().strength(-500))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(50));  // Add collision force to prevent label overlap


        var link = g.append("g")
            .selectAll("line")
            .data(uniqueLinks)
            .join("line")
            .attr("class", "link")
            .attr('marker-end', d => d.marker); // Add the marker to the links based on the direction

        var node = g.append("g")
            .selectAll("circle")
            .data(nodes)
            .join("circle")
            .attr("class", "node")
            .attr("r", 20)
            .attr("fill", "blue")
            .call(drag(simulation));

        var labels = g.append("g")
            .selectAll("text")
            .data(uniqueLinks)
            .join("text")
            .text(d => d.source.id.split(":")[1] + " " + d.direction + " " + d.target.id.split(":")[1])
            .attr("x", d => (d.source.x + d.target.x) / 2)
            .attr("y", d => (d.source.y + d.target.y) / 2)
            .attr("dy", "-1em")
            .style("text-anchor", "middle");

        // Add labels for nodes
        var nodeLabels = g.append("g")
            .selectAll("text")
            .data(nodes)
            .join("text")
            .text(d => d.id)
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("dy", "1em")
            .style("text-anchor", "middle");

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
                .text(d => d.source.id.split(":")[1] + " -> " + d.target.id.split(":")[1])
                .attr("x", d => (d.source.x + d.target.x) / 2)
                .attr("y", d => (d.source.y + d.target.y) / 2 - 15);

            nodeLabels
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
}