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
 
 
 
 function pinta_datos(){
	 var fecha = new Date(),
 	  dias = ["Domingo", "Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"],
 	  numero_dia = fecha.getDate(),
 	  dia = fecha.getDay(),
 	  mes = fecha.getMonth()+1,
 	  ano = fecha.getFullYear(),
     matriz_turnos=["","M","T","AM","AT","L","FM","FT","D"],
     texto_turnos=["","Mañana","Tarde","Amp. mañana","Amp.","Libre","Fest. mañana","Fest. tarde","Domingo"],
     mes_str, mes2, turnos, turnos2, turno;

     
     mes_str = mes<10 ? "0"+mes:mes;
     turnos = tizen.preference.getValue(ano+""+mes_str);
     mes2 = mes===12?1:mes+1;
     mes_str = (mes2)<10 ? "0"+(mes2):(mes2);
     turnos2 = tizen.preference.getValue(ano+""+mes_str);
     for (var i = 0; i < 7; i++)
   	{
   	turno = turnos.substring(numero_dia-1,numero_dia);
   	document.getElementById(String(i)).textContent = dias[dia]+" "+numero_dia+": "+texto_turnos[turno];
   	document.getElementById(String(i)).className = matriz_turnos[turno];
   	dia = dia+1;
   	numero_dia=numero_dia+1;
   	if (dia === 7) {dia=0;}
	    if (numero_dia > numero_de_dias(mes,ano))
	      {	            	    	
		   numero_dia = 1;
		   turnos=turnos2;
	      }
   	}
 }

function onGetAppsContextSuccess(){console.log("Lanzada");}
window.onclick = function() 
   {
   tizen.application.launch('N62vYV2S2y.Calendariodeturnos', onGetAppsContextSuccess);
   };

   
   
window.onload = function() {
     pinta_datos();
    };
    
window.visibilityChange = function() {
     pinta_datos();
    };    
