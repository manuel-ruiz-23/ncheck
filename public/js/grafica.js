var socket = io();

socket.on('connect',function () {
    console.log('Connected to server - graph'); 
});

socket.on('disconnect',function () {
    console.log('Disconected from server - graph');
});



window.onload = function () {

    var dps = []; // dataPoints
    var chart = new CanvasJS.Chart("chartContainer", {

        interactivityEnabled: false,
        backgroundColor: "green",
        title :{
            text: "Ecg"
        },
        axisY: {
            includeZero: false
        },      
        data: [{
            type: "line",
            dataPoints: dps
        }]
    });
    
    var xVal = 0;
    //var yVal = 20; 
    var updateInterval = 1000;
    var dataLength = 300; // number of dataPoints visible at any point
    
    var updateChart = function (ecg) {
        
        for(i = 0; i <= ecg.length; i++){
            dps.push({
                x: xVal,
                y: ecg[i]
            });
            xVal++;
        
            if (dps.length > dataLength) {
                dps.shift();
            }
            
            chart.render();     
        }
        // chart.render();
    };
    
    socket.on('grafica',function(ecg){
        console.log('ecg',ecg);
        updateChart(ecg);
    });
    
}
