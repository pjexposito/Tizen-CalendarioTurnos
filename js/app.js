/*
 * Copyright (c) 2015 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


var con_dias, con_numeros,
    textbox = document.querySelector("#contents"),
    meses = ["","Enero", "Febrero", "Marzo", "Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
    fecha = new Date(),
    mes = fecha.getMonth()+1,
    ano = fecha.getFullYear(),
    dia_actual = fecha.getDate(),
    actualiza = 0,
    numeros = 1;
       
function pinta_mes(){
    if (numeros===1){
    	textbox.innerHTML = "<b id=cabecera>"+ano+"<br>"+meses[mes]+"</b>"+con_numeros;
    }
    else {
    	textbox.innerHTML = "<b id=cabecera>"+ano+"<br>"+meses[mes]+"</b>"+con_dias;
	}
	if (actualiza===3){
		textbox.innerHTML = "<b id=cabecera>Pulsa en pantalla<br>para actualizar los datos</b>";
	}
    
}

function descarga_datos() { 
	console.log("Descargando...");
	var xmlhttp = new XMLHttpRequest(),
        datos,
        XML_ADDRESS = "http://pjexposito.pe.hu/datos2.php",
        XML_METHOD = "GET",
		base_datos;
        xmlhttp.open(XML_METHOD, XML_ADDRESS, false);
        xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            datos = xmlhttp.responseText;
            base_datos = JSON.parse(datos);
      		for (var t in base_datos.main){
      			tizen.preference.setValue(base_datos.main[t].substring(2, 8),base_datos.main[t].substring(8));      	  			
  	  		}
            crea_calendario();
            pinta_mes();
            xmlhttp = null;
        } else {
            console.log("Error");
        }
    };
    xmlhttp.send();
    
}    

function numero_de_dias(month, year)
{
  var numberOfDays;  
  if (month === 4 || month === 6 || month === 9 || month === 11)  
    {numberOfDays = 30;}
  else if (month === 2)  
    { 
      var isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);  
      if (isLeapYear){numberOfDays = 29;}
      else  {numberOfDays = 28;}
    }  
   else 
     {numberOfDays = 31;}
   return numberOfDays;
 }  

function dia_semana(month,year)
{
	var posicion = new Date(year,month-1,1).getDay();  
	posicion = (posicion===0) ? 7:posicion;
	return posicion;
}

function crea_calendario(){

	con_numeros = "<table><tr>"+
		    "<td id=C>L</td>"+
		    "<td id=C>M</td>"+
		    "<td id=C>X</td>"+
		    "<td id=C>J</td>"+
		    "<td id=C>V</td>"+
		    "<td id=C>S</td>"+
		    "<td id=C>D</td>"+
		  "</tr>";
	con_numeros = con_numeros+"<tr>";
	con_dias = con_numeros;
		var dia=0,
		    dia_mostrar="",
		    limite,
		    dummy="00000000000000000000000000000000000000000000000000",
		    turnos,
		    turno,
		    turno_mostrar,
		    mes_str,
		    negrita,
		    negrita2,
		    matriz_turnos=["","M","T","AM","AT","L","FM","FT","D"];

	    mes_str = mes<10 ? "0"+mes:mes;
		if (tizen.preference.exists(ano+""+mes_str))
		  {
		    turnos = tizen.preference.getValue(ano+""+mes_str);
		  }
		else
		  {
			turnos= dummy;
		  }
		if (numero_de_dias(mes,ano)+dia_semana(mes,ano)>36){
		  limite = 43;
		  }
		else
	      {
			limite=36;
		  }
	for (var i= 1;i< limite;i++)
		{
		if (i>=dia_semana(mes,ano))
			{
			dia=dia+1;
			dia_mostrar = dia;
            turno = turnos.substring(dia_mostrar-1,dia_mostrar);
            if (!turno)
            	{
        			turno = 0;
        			turno_mostrar = "";
            	}
            turno=matriz_turnos[turno];
            turno_mostrar = turno;

			}
		if (dia>numero_de_dias(mes,ano) || i<dia_semana(mes,ano))
			{
			dia_mostrar="";
			turno = "Vacio";
			turno_mostrar = "";
			}    		
        if ((dia===dia_actual) && (mes===fecha.getMonth()+1)){
		negrita = "<em>";
        negrita2 = "</em>";
        }
        else
        	{
        	negrita="";
        	negrita2="";
        	}
		con_numeros = con_numeros+"<td id="+turno+">"+negrita+dia_mostrar+negrita2+"</td>";
		con_dias = con_dias+"<td id="+turno+">"+negrita+turno_mostrar+negrita2+"</td>";
		if ((i===7) || (i===14) || (i===21) || (i===28)|| (i===35)) 
		{
		  con_numeros=con_numeros+"</tr>"+"<tr>";
		  con_dias = con_dias+"</tr>"+"<tr>";
		}
		}
	if (i<37){
	  con_numeros = con_numeros.slice(0, -9);
	  con_dias = con_dias.slice(0, -9);
	}
	con_numeros = con_numeros+"</tr></table>";
	con_dias = con_dias+"</tr></table>";


}    

(function() {
    /**
     * Handles the hardware key event.
     * @private
     * @param {Object} event - The hardware key event object
     */
    function keyEventHandler(event) 
      {
    	if (event.keyName === "back") 
    	  {
    	  try {tizen.application.getCurrentApplication().exit();}
    	  catch (ignore) {}
    	  }
      } 

    /**
     * Initializes the application.
     * @private
     */
    
  function init() {

	
// También se puede usar tizen.preference.exists('key1') para ver si un valor existe.

	document.addEventListener("tizenhwkey", keyEventHandler);
    document.addEventListener('rotarydetent', function(ev) {
        var direction = ev.detail.direction;
        if (direction === 'CW') {
        	if (actualiza===1)
        		{
        		actualiza =2;
        		}
        	else {
        		actualiza = 0;
        	}
        	mes = mes+1;
        	if (mes > 12) {
        		mes = 1;
        		ano = ano+1;
        	}
        } else if (direction === 'CCW') {
        	if (actualiza===0) {
        		actualiza = 1;
        	}
        	else if (actualiza===2){
        		actualiza =3;
        	}
        	else {
        		actualiza=0;
        	}
            mes = mes-1;
        	if (mes < 1) {
        		mes = 12;
        		ano = ano-1;
        	}
        }
    	console.log(actualiza);

        crea_calendario();
        pinta_mes();
    });
    
    
    
    
    textbox.addEventListener("click", 
      function() 
        {	
    	if (actualiza===3){
            navigator.vibrate([300, 100, 200, 100, 400]);
    		descarga_datos();
    	}
		actualiza = 0;
        numeros = (numeros===1) ? 0 : 1;
        pinta_mes();
        }); 
    
    var mes_str = mes<10 ? "0"+mes:mes;
	if (!tizen.preference.exists(ano+""+mes_str)){
		descarga_datos();

	}
    crea_calendario();
    pinta_mes();
    
    } // Cierra la función INIT

    // The function "init" will be executed after the application successfully loaded.
    window.onload = init;
}()); // Esto cierra la función principal y el programa