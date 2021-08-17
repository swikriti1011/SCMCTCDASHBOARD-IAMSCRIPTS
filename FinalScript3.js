const mqtt = require('mqtt')
const fs = require("fs");
const http = require('http');
const request = require('request');

const timeout = ms => new Promise(res => setTimeout(res, ms))

var SENSOR_ALTERNATE_ID = 'Air_Comp_GA90_Temp';
var CAPABILITY_ALTERNATE_ID = 'Comp_GA90_Ind_Grp';
var DEVICE_ALTERNATE_ID = 'CCFF7093549B45FB81C8D59E8681748F';

var HOST_ADDRESS = '58a1ef3d-f554-4c32-83ab-6753d7bdf108.eu10.cp.iot.sap'

var rn = require('random-number');
var Comp_Outlet_Temerature; 
// rn.generator({
//       min:  0
//     , max:  100
//     , integer: true
// })

// Change this value to adjust the water consumption
//dpoilseperator_val = 21;

//var Comp_Outlet_Temerature = rn.generator({
  //    min:  0.20
 //   , max:  0.80
 //   , float: true
//})


var urlget = " https://europe-global-account-sapinnovation-accenture-com-dev-d7cc28886.cfapps.eu10.hana.ondemand.com/catalog/sensor_data?$filter=sensor_id%20eq%20%27" + SENSOR_ALTERNATE_ID + "%27";
var urlcreate= " https://europe-global-account-sapinnovation-accenture-com-dev-d7cc28886.cfapps.eu10.hana.ondemand.com/catalog/sensor_data";
var urlupdate="https://europe-global-account-sapinnovation-accenture-com-dev-d7cc28886.cfapps.eu10.hana.ondemand.com/catalog/sensor_data/" + SENSOR_ALTERNATE_ID + "";
var min=45;
var max=65;
var threshold=69;


const CERTIFICATE_FILE = './CCFF7093549B45FB81C8D59E8681748F-device_certificate.pem';
const PASSPHRASE_FILE = './CCFF7093549B45FB81C8D59E8681748F_secret_key.txt';
var mqttClient;

//Connect to MQTT
function ConnectMQTTChannel(_SENSOR_ALTERNATE_ID,_CAPABILITY_ALTERNATE_ID,_DEVICE_ALTERNATE_ID){

    SENSOR_ALTERNATE_ID     = _SENSOR_ALTERNATE_ID;
    CAPABILITY_ALTERNATE_ID = _CAPABILITY_ALTERNATE_ID;
    DEVICE_ALTERNATE_ID     = _DEVICE_ALTERNATE_ID;

   mqttClient = connectToMQTT()

}

//csvfunction
async function sendDataViaMQTT() {
	//var today = new Date().toISOString().slice(0, 10);
	//	var today = new Date();
	// today=((today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear());
	//var today = new Date().toISOString().slice(0, 10);
	while(true){
		await timeout(3600000)
		//await timeout(60000)
 request({

            url: urlget,
            
            headers: {
                "Authorization": "Basic",
                "Content-Type": "application/json"

            }

        }, function (error, response, body) {
            if (!error&& response.statusCode == 200) {
				console.log("fetched get data");

                var sdata = JSON.parse(body)
                
               var len = sdata.value.length;
			   console.log("Sensor record"+len);
			   if(len==0){
			 var today = new Date().toISOString().slice(0, 10);
			console.log("Insert Sensor data");   
			 var entity={
				"sensor_id": SENSOR_ALTERNATE_ID,
            "min_value": min,
            "max_value": 55,
            "date":today ,
            "thflag": ""
			};
			
			 request({
                                    url:urlcreate,
                                    method: 'POST',
                                    headers: {
                                          "Authorization": "Basic",
                                        "Content-Type": "application/json"
                                       // "X-Requested-With": "XMLHttpRequest",
                                    
                                        
                                    },

                                    json: entity
                                }, function (error, response, body) {
									//console.log(body.asString());
									//JSON.parse(response);
                                      //console.log(response);
                                    // handle response
                                  if (!error && response.statusCode == 201) {

			console.log("created");
		// process.exit();
									}

                               //}        
								});
								
								
								
								
								
				  var payload = {
        sensorAlternateId: SENSOR_ALTERNATE_ID,
        capabilityAlternateId: CAPABILITY_ALTERNATE_ID,
        measures: [

            {"Comp_Outlet_Temerature":min}

           ]
        }
       console.log(payload);
		//console.log(dpoilseperator_val);
        var topicName = 'measures/' + DEVICE_ALTERNATE_ID;
       mqttClient.publish(topicName, JSON.stringify(payload), [], error => {
         if(!error) {
             console.log("Data successfully sent!");
          } else {
              console.log("An unecpected error occurred:", error);
          }
			

        });						
								
								
								
								
								
								
								
								
								

			

			   }// end of len if 
                 
               else{
				   console.log("Else block with already created data");
				 var date=sdata.value[0].date;
				 var minval=sdata.value[0].min_value;
				 var maxval=sdata.value[0].max_value;
				 
				 	var todayformat = new Date();
	 todayformat=((todayformat.getMonth() + 1) + '/' + todayformat.getDate() + '/' + todayformat.getFullYear());
	 
	 console.log("newdate"+todayformat);
	 
		var olddate = new Date(date);
	 olddate=((olddate.getMonth() + 1) + '/' + olddate.getDate() + '/' + olddate.getFullYear());
	 
	 console.log("olddate"+olddate);
	 
	 
			//	 var diffDays = parseInt((todayformat - olddate) / (1000 * 60 * 60 * 24)); //gives day difference
				 
				 
			//	 var date1 = new Date("7/11/2010");
//var date2 = new Date("8/11/2010");
//var diffDays = parseInt((todayformat - olddate) / (1000 * 60 * 60 * 24), 10); 
				 var date2 = new Date(todayformat);
var date1 = new Date(olddate);
var diffDays = date2.getDate() - date1.getDate(); 
//alert(diffDays)
			
                  console.log("Date difference:" +diffDays);

				  			 var today = new Date().toISOString().slice(0, 10);
				 
				  
				  if(diffDays<=1 && maxval==55 )
					   {
						   var Comp_Outlet_Temerature = rn.generator({
                                 min:  min
                                , max:  55
                                 , integer: true
                                 });
								 
							var payload = {
        sensorAlternateId: SENSOR_ALTERNATE_ID,
        capabilityAlternateId: CAPABILITY_ALTERNATE_ID,
        measures: [

            {"Comp_Outlet_Temerature":Comp_Outlet_Temerature()}

           ]
        }
       console.log(payload);
		//console.log(dpoilseperator_val);
        var topicName = 'measures/' + DEVICE_ALTERNATE_ID;
       mqttClient.publish(topicName, JSON.stringify(payload), [], error => {
         if(!error) {
             console.log("Data successfully sent!");
          } else {
              console.log("An unecpected error occurred:", error);
          }
			

        });				 
								 
			   
					   }
					   else if(diffDays==2&& maxval==55 )
					   {
						   
						    var Comp_Outlet_Temerature = rn.generator({
                                 min:  min
                                , max:  60
                                 , integer: true
                                 });
								 
						            var entity={
			//"sensor_id": SENSOR_ALTERNATE_ID,
             "min_value": min,
            "max_value": 60,
            "date":today ,
            "thflag": ""

			};
			          request({
                                    url:urlupdate,
                                    method: 'PUT',
                                    headers: {
                                          "Authorization": "Basic",
                                        "Content-Type": "application/json"
                                       // "X-Requested-With": "XMLHttpRequest",
                                    
                                        
                                    },

                                    json: entity
                                }, function (error, response, body) {
									
                                    if (!error) {

			              console.log("updated");
			                    //process.exit();
									}

                               //}        
								});
		 
								var payload = {
        sensorAlternateId: SENSOR_ALTERNATE_ID,
        capabilityAlternateId: CAPABILITY_ALTERNATE_ID,
        measures: [

            {"Comp_Outlet_Temerature":Comp_Outlet_Temerature()}

           ]
        }
       console.log(payload);
		//console.log(dpoilseperator_val);
        var topicName = 'measures/' + DEVICE_ALTERNATE_ID;
       mqttClient.publish(topicName, JSON.stringify(payload), [], error => {
         if(!error) {
             console.log("Data successfully sent!");
          } else {
              console.log("An unecpected error occurred:", error);
          }
			

        });				 
								  
						 
								 
					   }
				 
				 else if(diffDays<=1 && maxval==60 )
				 {
					 	    var Comp_Outlet_Temerature = rn.generator({
                                 min:  min
                                , max:  60
                                 , integer: true
                                 });
								 
					var payload = {
        sensorAlternateId: SENSOR_ALTERNATE_ID,
        capabilityAlternateId: CAPABILITY_ALTERNATE_ID,
        measures: [

            {"Comp_Outlet_Temerature":Comp_Outlet_Temerature()}

           ]
        }
       console.log(payload);
		//console.log(dpoilseperator_val);
        var topicName = 'measures/' + DEVICE_ALTERNATE_ID;
       mqttClient.publish(topicName, JSON.stringify(payload), [], error => {
         if(!error) {
             console.log("Data successfully sent!");
          } else {
              console.log("An unecpected error occurred:", error);
          }
			

        });				 
								 			 
				 
								 
				 }
				 
				 else if(diffDays==2&& maxval==60 )
				 {
					 	    var Comp_Outlet_Temerature = rn.generator({
                                 min:  min
                                , max:  65
                                 , integer: true
                                 });
								 
								    var entity={
			//"sensor_id": SENSOR_ALTERNATE_ID,
             "min_value": min,
            "max_value": 65,
            "date":today ,
            "thflag": ""

			};
			          request({
                                    url:urlupdate,
                                    method: 'PUT',
                                    headers: {
                                          "Authorization": "Basic",
                                        "Content-Type": "application/json"
                                       // "X-Requested-With": "XMLHttpRequest",
                                    
                                        
                                    },

                                    json: entity
                                }, function (error, response, body) {
									
                                    if (!error) {

			              console.log("updated");
			                    //process.exit();
									}

                               //}        
								});
								
								
								
								var payload = {
        sensorAlternateId: SENSOR_ALTERNATE_ID,
        capabilityAlternateId: CAPABILITY_ALTERNATE_ID,
        measures: [

            {"Comp_Outlet_Temerature":Comp_Outlet_Temerature()}

           ]
        }
       console.log(payload);
		//console.log(dpoilseperator_val);
        var topicName = 'measures/' + DEVICE_ALTERNATE_ID;
       mqttClient.publish(topicName, JSON.stringify(payload), [], error => {
         if(!error) {
             console.log("Data successfully sent!");
          } else {
              console.log("An unecpected error occurred:", error);
          }
			

        });				 
								 
		 		 
								 
				 }
				 
				  else if(diffDays<=1 && maxval==65 )
				 {
					 	    var Comp_Outlet_Temerature = rn.generator({
                                 min:  min
                                , max:  65
                                 , integer: true
                                 });
								 
						var payload = {
        sensorAlternateId: SENSOR_ALTERNATE_ID,
        capabilityAlternateId:[]
=		CAPABILITY_ALTERNATE_ID,
        measures: [

            {"Comp_Outlet_Temerature":Comp_Outlet_Temerature()}

           ]
        }
       console.log(payload);
		//console.log(dpoilseperator_val);
        var topicName = 'measures/' + DEVICE_ALTERNATE_ID;
       mqttClient.publish(topicName, JSON.stringify(payload), [], error => {
         if(!error) {
             console.log("Data successfully sent!");
          } else {
              console.log("An unecpected error occurred:", error);
          }
			

        });				 
								 		 

								 
				 }
				 
				 
							  else if(diffDays==2 && maxval==65 )
				 {
					 	    var Comp_Outlet_Temerature = rn.generator({
                                 min:  66
                                , max:  69
                                 , integer: true
                                 });
								 
								    var entity={
			//"sensor_id": SENSOR_ALTERNATE_ID,
             "min_value": 45,
            "max_value": 69,
            "date":today ,
            "thflag": "X"

			};
			          request({
                                    url:urlupdate,
                                    method: 'PUT',
                                    headers: {
                                          "Authorization": "Basic",
                                        "Content-Type": "application/json"
                                       // "X-Requested-With": "XMLHttpRequest",
                                    
                                        
                                    },

                                    json: entity
                                }, function (error, response, body) {
									
                                    if (!error) {

			              console.log("updated");
			                    //process.exit();
									}

                               //}        
								});
									 
						 
						var payload = {
        sensorAlternateId: SENSOR_ALTERNATE_ID,
        capabilityAlternateId: CAPABILITY_ALTERNATE_ID,
        measures: [

            {"Comp_Outlet_Temerature":Comp_Outlet_Temerature()}

           ]
        }
       console.log(payload);
		//console.log(dpoilseperator_val);
        var topicName = 'measures/' + DEVICE_ALTERNATE_ID;
       mqttClient.publish(topicName, JSON.stringify(payload), [], error => {
         if(!error) {
             console.log("Data successfully sent!");
          } else {
              console.log("An unecpected error occurred:", error);
          }
			

        });				 
								 		 

								 
				 }


							  else if(diffDays==1&& maxval==69 )
				 {	 
                          console.log("Running Maintenance Activity");
								 
				 }
				 
				 else if(diffDays==2 && maxval==69){
					 
				 var Comp_Outlet_Temerature = rn.generator({
                                 min:  45
                                , max:  55
                                 , integer: true
                                 });
								 
								    var entity={
			//"sensor_id": SENSOR_ALTERNATE_ID,
             "min_value": 45,
            "max_value": 55,
            "date":today ,
            "thflag": ""

			};
			          request({
                                    url:urlupdate,
                                    method: 'PUT',
                                    headers: {
                                          "Authorization": "Basic",
                                        "Content-Type": "application/json"
                                       // "X-Requested-With": "XMLHttpRequest",
                                    
                                        
                                    },

                                    json: entity
                                }, function (error, response, body) {
									
                                    if (!error) {

			              console.log("updated");
			                    //process.exit();
									}

                               //}        
								});
									 
						 
						var payload = {
        sensorAlternateId: SENSOR_ALTERNATE_ID,
        capabilityAlternateId: CAPABILITY_ALTERNATE_ID,
        measures: [

            {"Comp_Outlet_Temerature":Comp_Outlet_Temerature()}

           ]
        }
       console.log(payload);
		//console.log(dpoilseperator_val);
        var topicName = 'measures/' + DEVICE_ALTERNATE_ID;
       mqttClient.publish(topicName, JSON.stringify(payload), [], error => {
         if(!error) {
             console.log("Data successfully sent!");
          } else {
              console.log("An unecpected error occurred:", error);
          }
			

        });				 
								 		 
	 
					 
					 
					 
					 
					 
					 
				 }
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				
				   
			   } // end of else of if already record exist


				 

			   
				   
			  


            }// end read request if no error condition
	

            
		

        }); // end of read request
	
	
	
	
	}// while closing 
	

	
	
	
	
	
	///////////////////////////New code end//////////////////////////////////////////////////////////////////////////////////
	

   
}

function connectToMQTT() {
    var options = {
        keepalive: 10,
        clientId: DEVICE_ALTERNATE_ID,
        clean: true,
       reconnectPeriod: 2000,
        connectTimeout: 2000,
        cert: fs.readFileSync('./CCFF7093549B45FB81C8D59E8681748F-device_certificate.pem'),
        key: fs.readFileSync('./CCFF7093549B45FB81C8D59E8681748F-device_certificate.pem'),
        passphrase: fs.readFileSync('./CCFF7093549B45FB81C8D59E8681748F_secret_key.txt').toString(),  
        rejectUnauthorized: false
    };

    var mqttClient = mqtt.connect(`mqtts://${HOST_ADDRESS}:8883`, options);

    mqttClient.subscribe('ack/' + DEVICE_ALTERNATE_ID);
    mqttClient.on('connect', () => {console.log("Connection established!")
       sendDataViaMQTT();
	 
	  
    });
    mqttClient.on("error", err => console.log("Unexpected error occurred:", err));
   mqttClient.on('reconnect', () => console.log("Reconnected!"));
   mqttClient.on('close', () => console.log("Disconnected!"));
   mqttClient.on('message', (topic, msg) => console.log("Received acknowledgement for message:", msg.toString()));
	//mqttClient.end();
		//process.exit();

    return mqttClient
	
	
}

ConnectMQTTChannel(SENSOR_ALTERNATE_ID,CAPABILITY_ALTERNATE_ID,DEVICE_ALTERNATE_ID);

module.exports = {
    connectMQTTChannel : ConnectMQTTChannel
}