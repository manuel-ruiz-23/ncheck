var socket = io();
var userId = document.getElementById('userId').value;


socket.on('connect',function () {
    if(userId == ''){
        console.log('sad');
        window.location.replace("/auth/login");
    }
    console.log('Connected to server, userId',userId);
    socket.emit('joinRoom',{userId});
});

socket.on('disconnect',function () {
    console.log('Disconected from server');
});

socket.on('alerta',function (){
    Android.alerta();
});

socket.on('ecg',function (ecg){
    console.log('ecg',ecg);
    // document.write(spo2);
    document.getElementById("ecg").innerHTML = ecg;
});

window.onload = function () {

    var dps = []; // dataPoint
    var chart = new CanvasJS.Chart("chartContainer", {

        interactivityEnabled: false,
        title :{
            text: "Spo2"
        },
        axisY: {
            includeZero: false,
            minimum: 90,
            maximum: 101,
            gridThickness: 0
        },
        axisX:{
            title: "",
            tickLength: 0,
            margin:0,
            lineThickness:0,
            valueFormatString:" " //comment this to show numeric values
        },      
        data: [{
            type: "line",
            dataPoints: dps
        }]
    });
    
    var xVal = 0;
    var updateInterval = 1000;
    var dataLength = 20;
    
    var updateChart = function (yVal) {
        dps.push({
            x: xVal,
            y: yVal
        });
        xVal++;
    
        if (dps.length > dataLength) {
            dps.shift();
        }
        chart.render();
    };
    
    socket.on('spo2',function (spo2){
        console.log('sop2',spo2);
        if(spo2 == '-1'){
            alert("Error en la lectura");
        }else{
           document.getElementById("spo2value").innerHTML = spo2;
          // Android.showToast(spo2);
           updateChart(parseInt(spo2));
        }
    });

    
}
// function colorChange()hj{
//     var i = document.getElementById("spo2value").innerHTML;
//     console.log(i);
// }