/**
 * Created by Bargamut on 08.05.14
 * Time: 0:42
 */

var morrisObj, periodTemerature;
var morrisTemplate = {
        element: 'myfirstchart',    // ID of the element in which to draw the chart.
        // Chart data records -- each entry in this array corresponds to a point on the chart.
        data: [{ time: currentTime(), t1: 0.0, t2: 0.0, t3: 0.0, b: 0 }],
        xkey: 'time',               // The name of the data record attribute that contains x-values.
        ykeys: ['t1', 't2', 't3', 'b'],  // A list of names of data record attributes that contain y-values.
        labels: ['T1', 'T2', 'T3', 'V'],  // Labels for the ykeys -- will be displayed when you hover over the chart.
        lineColors: ["#0000ff", "#eea131", "#00ff00", "#aa0000"],
        axes: true,
        grid: true,
        fillOpacity: .5
    };

$(function() {
    resizeGraph();

    periodTemerature    = setInterval(function() { getDeviceData(); }, 5000);
    morrisObj           = new Morris.Line(morrisTemplate);

    $(window).resize(function() { resizeGraph(); });
});

function resizeGraph() {
    var currHeight = $(document).height() * .8;

    $("#myfirstchart").css({ height: currHeight + 'px' });
}

// Берём данные температуры удалённо
function getDeviceData() {
    $.ajax({
        url: "http://192.168.210.13",
        type: "GET",
		timeout: 15000,
        dataType: "json",
		data: "a=2&b=3",
        complete: function(data) {
            var items   = $.parseJSON(data.responseText),
                itemObj = { time: currentTime() };

            for (var v in items.items) {
                if (v != 'total') {
                    itemObj['t' + v] = items.items[v];
                }
            }

            itemObj['b'] = 0 + items.button * 60;

            morrisTemplate.data.push(itemObj);
            $('#myfirstchart').html('');
            morrisObj = new Morris.Line(morrisTemplate);
        }
    });
}

function currentTime() {
    var dateNow = new Date();

    return dateNow.getFullYear() + "-" +
        checkZero((dateNow.getMonth() + 1)) + "-" +
        checkZero(dateNow.getDate()) + " " +
        checkZero(dateNow.getHours()) + ":" +
        checkZero(dateNow.getMinutes()) + ":" +
        checkZero(dateNow.getSeconds());
}

function checkZero(n) {
    return (n < 10) ? '0' + n : n;
}