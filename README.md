# TranquilityServerAPI

[![DeepScan grade](https://deepscan.io/api/teams/13554/projects/16524/branches/357480/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=13554&pid=16524&bid=357480)


# # Formatting
- For all HTTP Parmas the varible names have to be uppercase such that, req.params.MemberID `/guild/:MemberID/:GuildID/:GuildInvite`


# # Post mon

Script to allow multiple data streams
 
let template = `
    <canvas id="myChart"></canvas>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>

<script>
    pm.getData( function (error, data) {

var data_t = {
    labels: Object.entries(data.response.times).map( (item) => item[1]),
    datasets: [ ],
};

data.response.all.forEach(e => {
    data_t.datasets.push(e);
});

        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            type: 'line',
            data: data_t,   
            // Configuration options go here
            options: {}
        });
    });
</script>
`;

// Set visualizer
pm.visualizer.set(template, {
    // Pass the response body parsed as JSON as `data`
    response: pm.response.json()
});
