var currentMonitor = getCurrentMonitorObject();

if(currentMonitor != null){
	//var getMeasurementsUrl = 'http://127.0.0.1:8888/measurements';
	window.getMeasurementsUrl = 'http://' + currentMonitor.ip + '/measurements';
	//var getHostsUrl = 'http://127.0.0.1:8888/hosts';
	window.getHostsUrl = 'http://' + currentMonitor.ip + '/hosts';
	//var address = 'http://127.0.0.1:8888';
	window.address = '';///'http://89.79.119.210:1330';
}

var streamsData;
var measurementsData;
var hostsData;

var resourceIdGlobal = null;
var hostIdGlobal = '';
var resourceForGraphIdGlobal = '';
var resourceIsCompositeGlobal = '';

function getStreamsFromMonitor() {
	if(currentMonitor == null) {
		alert("Warning: no monitor choosed"); 
		return;
	}
	
	var filterNameId = document.getElementById('filterNameId').value;
	var filterMetricId = document.getElementById('filterMetricId').value;
	var filterDescriptionId = document.getElementById('filterDescriptionId').value;
	var filterUnitId = document.getElementById('filterUnitId').value;
	
	var concatenatedUrl = getMeasurementsUrl;
	
	if(filterNameId) {
		concatenatedUrl += "?resource=" + filterNameId;
	}
	else if(filterMetricId) {
		concatenatedUrl += "?metric=" + filterMetricId;
	}
	else if(filterDescriptionId) {
		concatenatedUrl += "?description=" + filterDescriptionId;
	}
	else if(filterUnitId) {
		concatenatedUrl += "?unit=" + filterUnitId;
	}
	
	console.log(concatenatedUrl);
	$.ajax({
        url: concatenatedUrl,
        type: 'GET'
    }).then(function(data) {
		streamsData = data;
    	createStreamsTable();
    });
	
}

function getStreamsFromMonitorByHostId() {
	if(currentMonitor == null) {
		alert("Warning: no monitor choosed"); 
		return;
	}
	
	var concatenatedUrl = getMeasurementsUrl;
	hostIdGlobal = localStorage.getItem("hostGlobalIdStorage");
	if(hostIdGlobal) {
		console.log(hostIdGlobal.length);
		concatenatedUrl += "?resource=" + hostIdGlobal;
	}
	console.log(concatenatedUrl);
	$.ajax({
        url: concatenatedUrl,
        type: 'GET'
    }).then(function(data) {
		streamsData = data;
		localStorage.setItem("hostGlobalIdStorage", '');
		hostIdGlobal = '';
    	createStreamsTable();
    });
	
}

function getMeasurementsFromMonitor() {
	if(currentMonitor == null) {
		alert("Warning: no monitor choosed"); 
		return;
	}
	
	var concatenatedUrl = getMeasurementsUrl;
	resourceIdGlobal = localStorage.getItem("resourceGlobalIdStorage");
	console.log(resourceIdGlobal);
	if(resourceIdGlobal) {
		concatenatedUrl += "/" + resourceIdGlobal;
	
		var limitIdValue = document.getElementById('limitId').value;
		if(limitIdValue) {
			concatenatedUrl += "?limit=" + limitIdValue;
		}
		
		console.log(concatenatedUrl);
		
		$.ajax({
			url: concatenatedUrl,
			type: 'GET'
		}).then(function(data) {
			measurementsData = data;
			console.log(measurementsData);
			createSimpleMeasurementsTable();
		});
	}

}

function getArchivalMeasurementsFromMonitor() {
	if(currentMonitor == null) {
		alert("Warning: no monitor choosed"); 
		return;
	}
	
	var concatenatedUrl = getMeasurementsUrl;
	resourceIdGlobal = localStorage.getItem("resourceGlobalIdStorage");
	console.log(resourceIdGlobal);
	if(resourceIdGlobal) {
		concatenatedUrl += "/" + resourceIdGlobal;
	
		var fromDateValue = document.getElementById('fromDateInput').value;
		var toDateValue = document.getElementById('toDateInput').value;
		
		if (!fromDateValue || !toDateValue) {
			alert("Warning: pick dates"); 
			return;
		}
		
		concatenatedUrl += "?from=" + fromDateValue;
		concatenatedUrl += "&to=" + toDateValue;
		
		console.log(concatenatedUrl);
		
		$.ajax({
			url: concatenatedUrl,
			type: 'GET'
		}).then(function(data) {
			measurementsData = data;
			console.log(measurementsData);
			createSimpleMeasurementsTable();
		});
	}
}

function getMeasurementsFromMonitorByResourceId() {
	if(currentMonitor == null) {
		alert("Warning: no monitor choosed"); 
		return;
	}
	
	var concatenatedUrl = getMeasurementsUrl;
	resourceIdGlobal = localStorage.getItem("resourceGlobalIdStorage");
	console.log(resourceIdGlobal);
	if(resourceIdGlobal) {
		concatenatedUrl += "/" + resourceIdGlobal;
	
		//var limitIdValue = document.getElementById('limitId').value;
		//if(limitIdValue) {
		//	concatenatedUrl += "?limit=" + limitIdValue;
		//}
		
		console.log(concatenatedUrl);
		
		$.ajax({
			url: concatenatedUrl,
			type: 'GET'
		}).then(function(data) {
			measurementsData = data;
			console.log(measurementsData);
			createSimpleMeasurementsTable();
		});
	}
	
	
}

function getHostsFromMonitor() {
	if(currentMonitor == null) {
		alert("Warning: no monitor choosed"); 
		return;
	}
	
	var concatenatedUrl = getHostsUrl;
	
	var hostNameIdValue = document.getElementById('hostNameId').value;
	if(hostNameIdValue) {
		concatenatedUrl += "?name=" + hostNameIdValue;
	}
	
	console.log(concatenatedUrl);
	
	$.ajax({
        url: concatenatedUrl,
        type: 'GET'
    }).then(function(data) {
		hostsData = data;
		console.log(hostsData);
		createHostsTable();
    });
	
}

function addCompositeMeasurement() {
    var concatenatedUrl = getMeasurementsUrl;
    var authData = {};
    authData.username = localStorage.getItem("username");
    authData.password = localStorage.getItem("password");
	
	var jsonData = {};
	jsonData.id = localStorage.getItem("resourceGlobalIdStorage");
	var measurementNameIdValue = document.getElementById('measurementNameId').value;
	var measurementPeriodIdValue = document.getElementById('measurementPeriodId').value;
	var measurementIntervalIdValue = document.getElementById('measurementIntervalId').value;
	console.log("test: " + measurementNameIdValue);
	if(measurementNameIdValue == "" || measurementPeriodIdValue == "" || measurementIntervalIdValue == "") {
		alert("All input fields are required!");
		return;
	}
	jsonData.name = measurementNameIdValue;
	jsonData.period = measurementPeriodIdValue;
	jsonData.interval = measurementIntervalIdValue;
	console.log(jsonData);

    $.ajax({
        url: concatenatedUrl,
        type: 'POST',
        //crossDomain: true,
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(jsonData),
        headers: {
            "Authorization": "Basic " + btoa(authData.username + ":" + authData.password)
        },
        success: function(data){
			window.location.href = "resources.html";
			alert("Composite measurement added");
        },
        error: function(xhr, ajaxOptions, thrownError) {
            if (xhr.status == 201)
            {
                window.location.href = "resources.html";
				alert("Composite measurement added");
            }
            else if(xhr.status == 400)
            {
                alert("Incorrect request parameters!");
            }
			else if(xhr.status == 401) {
				alert("Authentication is required!");
			}
			else {
				alert("Unknown error! Status: " + xhr.status);
			}
        }
    });
}

function deleteCompositeMeasurement() {
	var concatenatedUrl = getMeasurementsUrl + "/" + localStorage.getItem("resourceGlobalIdStorage");
    var authData = {};
    authData.username = localStorage.getItem("username");
    authData.password = localStorage.getItem("password");
	
	$.ajax({
        url: concatenatedUrl,
        type: 'DELETE',
        headers: {
            "Authorization": "Basic " + btoa(authData.username + ":" + authData.password)
        },
        success: function(data){
			window.location.href = "resources.html";
			alert("Composite measurement deleted");
        },
        error: function(xhr, ajaxOptions, thrownError) {
            if (xhr.status == 200)
            {
				window.location.href = "resources.html";
				alert("Composite measurement deleted");
            }
			else if(xhr.status == 401) {
				alert("Authentication is required!");
			}
			else if(xhr.status == 402) {
				alert("Logged user is not allowed to delete measurement!");
			}
			else if(xhr.status == 403) {
				alert("Resource with given id does not exist!");
			}
			else {
				alert("Unknown error! Status: " + xhr.status);
			}
        }
    });
}
 
function createStreamsTable() {
	if(currentMonitor == null) {
		alert("Warning: no monitor choosed"); 
		return;
	}
	
	var tableRef = document.getElementById('resourcesTableId').getElementsByTagName('tbody')[0];
	while(tableRef.rows.length > 0) {
		tableRef.deleteRow(0);
	}
	
	var tableRef = document.getElementById('resourcesTableId').getElementsByTagName('tbody')[0];
	for (var i = 0; i < streamsData.streams.length; ++i) {
		
		var newRow   = tableRef.insertRow(tableRef.rows.length);
		
		var newNameCell  = newRow.insertCell(0);
		var newNameText  = document.createTextNode(streamsData.streams[i].metadata.resourceName);
		newNameCell.appendChild(newNameText);
		
		var newMetricCell  = newRow.insertCell(1);
		var newMetricText  = document.createTextNode(streamsData.streams[i].metadata.metricName);
		newMetricCell.appendChild(newMetricText);
		
		var newDescriptionCell  = newRow.insertCell(2);
		var newDescriptionText  = document.createTextNode(streamsData.streams[i].metadata.description);
		newDescriptionCell.appendChild(newDescriptionText);
		
		var unitText = "";
		if(streamsData.streams[i].metadata.unitName !== undefined) {
			unitText = streamsData.streams[i].metadata.unitName;
		}
		var newUnitCell  = newRow.insertCell(3);
		var newUnitText  = document.createTextNode(unitText);
		newUnitCell.appendChild(newUnitText);
		
		
		var newButtonCell  = newRow.insertCell(4);
		
		var newMeasurementsButton  = document.createElement("BUTTON");
		var newMeasurementsButtonText = document.createTextNode("Go to measurements");
		newMeasurementsButton.setAttribute("id", streamsData.streams[i].id);
		if(streamsData.streams[i].metadata.isComposite == false) {
			newMeasurementsButton.setAttribute("content", "false");
		}
		else {
			newMeasurementsButton.setAttribute("content", "true");
		}
		newMeasurementsButton.setAttribute("name", "editButtonName" + i);
		newMeasurementsButton.setAttribute("className", "form-btn semibold");
		newMeasurementsButton.appendChild(newMeasurementsButtonText);
		
		newMeasurementsButton.onclick = function() {
			resourceIdGlobal = this.getAttribute("id");
			localStorage.setItem("resourceGlobalIdStorage", resourceIdGlobal);
			console.log(resourceIdGlobal);
			
			resourceIsCompositeGlobal = this.getAttribute("content");
			localStorage.setItem("resourceIsCompositeGlobalStorage", resourceIsCompositeGlobal);
			console.log(resourceIsCompositeGlobal);
			
			if(resourceIsCompositeGlobal = "false") {
				window.location.href = address + "simple.html";
			}
			else {
				window.location.href = address + "composite.html";
			}
			
		}
		newButtonCell.appendChild(newMeasurementsButton);
		
		var newGraphsButton  = document.createElement("BUTTON");
		var newMeasurementsButtonText = document.createTextNode("Go to graphs");
		newGraphsButton.setAttribute("id", streamsData.streams[i].id);
		newGraphsButton.setAttribute("name", "editButtonName" + i);
		newGraphsButton.setAttribute("className", "form-btn semibold");
		newGraphsButton.appendChild(newMeasurementsButtonText);
		
		newGraphsButton.onclick = function() {
			resourceForGraphIdGlobal = this.getAttribute("id");
			localStorage.setItem("resourceForGraphGlobalIdStorage", resourceForGraphIdGlobal);
			console.log(resourceForGraphIdGlobal);
			
			window.location.href = address + "graphs.html";
			
		}
		newButtonCell.appendChild(newGraphsButton);
		
		var actionButton  = document.createElement("BUTTON");
		var actionButtonText;
		if(streamsData.streams[i].metadata.isComposite == false) {
			actionButtonText = document.createTextNode("Add composite");
		}
		else {
			actionButtonText = document.createTextNode("Remove");
		}
		
		actionButton.setAttribute("id", streamsData.streams[i].id);
		if(streamsData.streams[i].metadata.isComposite == false) {
			actionButton.setAttribute("content", "false");
		}
		else {
			actionButton.setAttribute("content", "true");
		}
		
		actionButton.setAttribute("name", "actionButtonName" + i);
		actionButton.setAttribute("className", "form-btn semibold");
		actionButton.appendChild(actionButtonText);
		
		actionButton.onclick = function() {
			resourceIdGlobal = this.getAttribute("id");
			localStorage.setItem("resourceGlobalIdStorage", resourceIdGlobal);
			console.log("resourceIdGlobal: " + resourceIdGlobal);
			
			resourceIsCompositeGlobal = this.getAttribute("content");
			localStorage.setItem("resourceIsCompositeGlobalStorage", resourceIsCompositeGlobal);
			console.log(resourceIsCompositeGlobal);
			
			if(resourceIsCompositeGlobal == "false") {
				window.location.href = address + "createComposite.html";
			}
			else {
				deleteCompositeMeasurement();
			}
			
		}
		newButtonCell.appendChild(actionButton);
	}
	
}

function createSimpleMeasurementsTable() {
	if(currentMonitor == null) {
		alert("Warning: no monitor choosed"); 
		return;
	}
	
	document.getElementById('measurementLabelId').innerHTML = "Last measurements for resource name: " + measurementsData.metadata.resourceName + " , metric name: " + measurementsData.metadata.metricName;
	
	var tableRef = document.getElementById('measurementsTableId').getElementsByTagName('tbody')[0];
	while(tableRef.rows.length > 0) {
		tableRef.deleteRow(0);
	}
	console.log(measurementsData);
	console.log(measurementsData.measurements);
		
	for (var i = 0; i < measurementsData.measurements.length; ++i) {
		console.log(measurementsData.measurements[i].value);
		var newRow   = tableRef.insertRow(tableRef.rows.length);
		var newValueCell  = newRow.insertCell(0);
		var newValueText  = document.createTextNode(measurementsData.measurements[i].value);
		newValueCell.appendChild(newValueText);
		
		var newTimestampCell  = newRow.insertCell(1);
		var date = new Date(parseInt(measurementsData.measurements[i].timestamp));
		var newTimestampText = document.createTextNode(date);
		newTimestampCell.appendChild(newTimestampText);
	}
	
}

function createHostsTable() {
	if(currentMonitor == null) {
		alert("Warning: no monitor choosed"); 
		return;
	}
	
	var tableRef = document.getElementById('hostsTableId').getElementsByTagName('tbody')[0];
	while(tableRef.rows.length > 0) {
		tableRef.deleteRow(0);
	}
	console.log(hostsData);
	console.log(hostsData.hosts);
		
	for (var i = 0; i < hostsData.hosts.length; ++i) {
		console.log(hostsData.hosts[i].value);
		var newRow   = tableRef.insertRow(tableRef.rows.length);
		var newHostNameCell  = newRow.insertCell(0);
		var newHostNameText  = document.createTextNode(hostsData.hosts[i].hostName);
		newHostNameCell.appendChild(newHostNameText);
		
		var newButtonCell  = newRow.insertCell(1);
		
		var newResourcesButton  = document.createElement("BUTTON");
		var newResourcesButtonText = document.createTextNode("Go to resources");
		newResourcesButton.setAttribute("id", hostsData.hosts[i].hostName);
		newResourcesButton.setAttribute("name", "editButtonName" + i);
		newResourcesButton.setAttribute("className", "form-btn semibold");
		newResourcesButton.appendChild(newResourcesButtonText);
		
		newResourcesButton.onclick = function() {
			hostIdGlobal = this.getAttribute("id");
			localStorage.setItem("hostGlobalIdStorage", hostIdGlobal);
			console.log(hostIdGlobal);
			
			window.location.href = address + "resources.html";
			
		}
		newButtonCell.appendChild(newResourcesButton);
		
	}
	
}

$(function() {
    $('#side-menu').metisMenu();
});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    var url = window.location;
    // var element = $('ul.nav a').filter(function() {
    //     return this.href == url;
    // }).addClass('active').parent().parent().addClass('in').parent();
    var element = $('ul.nav a').filter(function() {
        return this.href == url;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
});


