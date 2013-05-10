(function( $ ) {
 $.fn.jpnCal = function( options ) {
  $.jpnCal(this, options);
  return this;
 };
  
 $.jpnCal = function (target, options){
  var settings = $.extend( {
   'dayDirection':'week', // horizontal vertical week
   'monthDirection':'vertical', // horizontal vertical
   'dayOffset':0,// no implement yet.
   'day':new Date(),
   'showMonths':2,
   'dow':['日','月','火','水','木','金','土'],
   'monthName':['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
   'holiday':[],
   'ex_holiday':[],
   'ex_workday':[],
   'dayCellWidth':30,
   'dayCellHeight':30,
   _target:target
  }, options);

  settings.day = new Date(settings.day.getFullYear(), settings.day.getMonth(), 1);
  settings.ex_holiday_array={};
  for(var datestr in settings.ex_holiday){
   settings.ex_holiday_array[settings.ex_holiday[datestr]]='true';
  }
  settings.ex_workday_array={};
  for(var datestr in settings.ex_workday){
   settings.ex_workday_array[settings.ex_workday[datestr]]='true';
  }

  if(typeof(ktHolidayName) == 'function'){
   settings.ktHolidayChk = ktHolidayName;
  }else{
   settings.ktHolidayChk = function(dd){
    return '';
   }
  }

  $(target).stop().empty();// target area init

  for (var sm=0; sm < settings.showMonths; sm++){
   if(settings.monthDirection === 'horizontal'){
    if(settings.dayDirection === 'week')
     $(target).append('<div class="jpnCalMo" style="float:left;witdh:'+eval((settings.dayCellWidth*settings.dow.length)+(settings.dow.length*2))+'px"></div>');
    else if(settings.dayDirection === 'horizontal')
     $(target).append('<div class="jpnCalMo" style="float:left;"></div>');
    else if(settings.dayDirection === 'vertical')
     $(target).append('<div class="jpnCalMo" style="float:left;"></div>');
   }else if(settings.monthDirection === 'vertical'){
    if(settings.dayDirection === 'week')
     $(target).append('<div class="jpnCalMo" style="width:'+eval((settings.dayCellWidth*settings.dow.length)+(settings.dow.length*2))+'px"></div>');
    else if(settings.dayDirection === 'horizontal')
     $(target).append('<div class="jpnCalMo" style=""></div>');
    else if(settings.dayDirection === 'vertical')
     $(target).append('<div class="jpnCalMo" style=""></div>');
   }
  }
  settings.cID = 'c'+ $('.jpnCalMo').length;

  $(target).append('<div style="clear:both;"></div>');
  
  $('.jpnCalMo', target).each(
   function (ind) {
    drawCal($(this), $.extend( {}, settings, {
     'ind':ind, 
     'day':new Date( new Date( settings.day.getTime() ).setMonth( new Date( settings.day.getTime() ).getMonth() + ind ))
    }));

//    $(this).append('<br style="clear:both;" />');
   }
  );

  function drawCal (target, settings) {
   var fd = new Date( new Date( settings.day.getTime() ).setDate(1) );
   var ldlm = new Date( new Date( fd.getTime() ).setDate(0) );
   var ld = new Date( new Date( new Date( fd.getTime() ).setMonth( fd.getMonth() + 1 ) ).setDate(0) );
   var copt = {fd:fd.getDay(), lld:ldlm.getDate(), ld:ld.getDate()};
   var offsetDayStart = ( ( copt.fd < settings.dayOffset ) ? ( settings.dayOffset - 7 ) : 1 );
   var offsetDayEnd = ( ( ld.getDay() < settings.dayOffset ) ? ( 7 - ld.getDay() ) : ld.getDay() );

   if(settings.dayDirection === 'week'){
    $(target).append('<div style="width:'+eval((settings.dayCellWidth*settings.dow.length)+(settings.dow.length*2))+'px">'+fd.getFullYear()+'年'+settings.monthName[fd.getMonth()]+'</div>');
    for (var ds=0+settings.dayOffset, length=ds+settings.dow.length; ds < length; ds++)
     $(target).append('<div class="dow" style="float:left;width:'+settings.dayCellWidth+'px;height:1.5em">' + settings.dow[ds%settings.dow.length] + '</div>');

    var calendar = $('<div id="calendar"></div>');   
    for ( var d = offsetDayStart, dE = ( copt.fd + copt.ld + ( 7 - offsetDayEnd ) ); d < dE; d++){
     $(calendar).append(
      (( d <= ( copt.fd - settings.dayOffset ) ) ? 
       '<div id="' + settings.cID + 'd' + d + '" class="pday" style="float:left;height:'+settings.dayCellHeight+'px;width:'+settings.dayCellWidth+'px">' + ( copt.lld - ( ( copt.fd - settings.dayOffset ) - d ) ) + '</div>' 
        : ( ( d > ( ( copt.fd - settings.dayOffset ) + copt.ld ) ) ?
       '<div id="' + settings.cID + 'd' + d + '" class="aday" style="float:left;height:'+settings.dayCellHeight+'px;width:'+settings.dayCellWidth+'px">' + ( d - ( ( copt.fd - settings.dayOffset ) + copt.ld ) ) + '</div>' 
        : '<div id="' + settings.cID + 'd_' + (fd.getMonth() + 1) + '_' + ( d - ( copt.fd - settings.dayOffset ) ) + '_' + fd.getFullYear() + '" class="' +
        ( dCheck( new Date( (new Date( fd.getTime() )).setDate( d - ( copt.fd - settings.dayOffset ) ) ) ,settings) || 'invday' ) + '"  style="float:left;height:'+settings.dayCellHeight+'px;width:'+settings.dayCellWidth+'px">' + ( d - ( copt.fd - settings.dayOffset ) )  + '</div>'
       ) 
      )
     );
    }
    $(target).append(calendar);
    $(calendar).find('div[id^=' + settings.cID + 'd]:first, div[id^=' + settings.cID + 'd]:nth-child(7n+1)').before( '<br style="clear:both;" />' );
    $(target).append('<br style="clear:both;" />');
   }else if(settings.dayDirection === 'horizontal'){
    $(target).append('<div style="width:7em">'+fd.getFullYear()+'年'+settings.monthName[fd.getMonth()]+'</div>');

    for ( var d = offsetDayStart, dE = ( copt.fd + copt.ld + ( 7 - offsetDayEnd ) ); d < dE; d++)
     $(target).append(
      (( d <= ( copt.fd - settings.dayOffset ) ) ? ''
        : ( ( d > ( ( copt.fd - settings.dayOffset ) + copt.ld ) ) ? ''
        : '<div id="' + settings.cID + 'd_' + (fd.getMonth() + 1) + '_' + ( d - ( copt.fd - settings.dayOffset ) ) + '_' + fd.getFullYear() + '" class="' +
        ( dCheck( new Date( (new Date( fd.getTime() )).setDate( d - ( copt.fd - settings.dayOffset ) ) ) ,settings) || 'invday' ) + '"  style="float:left;height:'+settings.dayCellHeight+'px;width:'+settings.dayCellWidth+'px">' + ( d - ( copt.fd - settings.dayOffset ) )  + '</div>'
       ) 
      )
     );
   }else if(settings.dayDirection === 'vertical'){
    $(target).append('<div style="width:7em">'+fd.getFullYear()+'年'+settings.monthName[fd.getMonth()]+'</div>');

    for ( var d = offsetDayStart, dE = ( copt.fd + copt.ld + ( 7 - offsetDayEnd ) ); d < dE; d++)
     $(target).append(
      (( d <= ( copt.fd - settings.dayOffset ) ) ? ''
        : ( ( d > ( ( copt.fd - settings.dayOffset ) + copt.ld ) ) ? ''
        : '<div id="' + settings.cID + 'd_' + (fd.getMonth() + 1) + '_' + ( d - ( copt.fd - settings.dayOffset ) ) + '_' + fd.getFullYear() + '" class="' +
        ( dCheck( new Date( (new Date( fd.getTime() )).setDate( d - ( copt.fd - settings.dayOffset ) ) ) ,settings) || 'invday' ) + '"  style="height:'+settings.dayCellHeight+'px;width:'+settings.dayCellWidth+'px">' + ( d - ( copt.fd - settings.dayOffset ) )  + '</div>'
       ) 
      )
     );
   }

  };

 function dCheck (day,settings) {
  var youbi = day.getDay();
  var dd = day.getFullYear()+"/"+(day.getMonth()+1)+"/"+day.getDate();
  if(dd in settings.ex_workday_array) return 'day day'+youbi;
  if(dd in settings.ex_holiday_array) return 'day holiday day'+youbi;
  if(settings.ktHolidayChk(dd) != "") return 'day holiday day'+youbi;
  for(var i=0;i<settings.holiday.length;i++)
   if(settings.holiday[i]==youbi) return 'day holiday day'+youbi;
  return 'day day'+youbi; 
 }


 };
})( jQuery );
