/*
a. Chenghai Cao
b. Chenghai_cao@student.uml.edu
c. Chenghai Cao is learning in Umass Lowell undergrad student, Computer Science Major, this is Chenghai Cao's homework 7 in 91.61 GUI Programming I as a student.
d. Aug/07/2020
e. This webpage is mainly displays an Interactive Dynamic Table by using the jQuery UI Slider and Tab Widgets.

Copyright (c) 2020 by Chenghai Cao. All rights reserved.
*/


//For full screen:
function fullScreen() {
       var element = document.documentElement;
       if (window.ActiveXObject) {
           var WsShell = new ActiveXObject('WScript.Shell');
           WsShell.SendKeys('{F11}');
       }
       // Firefox
       else if (element.mozRequestFullScreen) {
           element.mozRequestFullScreen();
       }
       //HTML
       else if (element.requestFullScreen) {
           element.requestFullScreen();
       }
       //Safari
       else if (element.webkitRequestFullScreen) {
           element.webkitRequestFullScreen();
       }
       //IE11
       else if (element.msRequestFullscreen) {
           element.msRequestFullscreen();
       }
}
//for minimize the screen
function fullExit() {
    var element = document.documentElement;
    if (window.ActiveXObject) {
        var WsShell = new ActiveXObject('WScript.Shell');
        WsShell.SendKeys('{F11}');
    }
    // Firefox
    else if (element.mozRequestFullScreen) {
        document.mozCancelFullScreen();
    }
    //HTML5
    else if (element.requestFullScreen) {
       document.exitFullscreen();
    }
    //IE 11
    else if (element.msRequestFullscreen) {
      document.msExitFullscreen();
    }
    //Safari
    else if (element.webkitRequestFullScreen) {
       document.webkitCancelFullScreen();
    }
}

//Here is the function to replace the element
//By using the parent nodes to check if new input updated and replace them.
function ElementReplacement(UpdatedVal, parentNode) {
    var prevVal;
    //The getElementById() method returns the element that has the ID attribute with the specified value.
    if((prevVal = document.getElementById(UpdatedVal.id)) && prevVal.parentNode === parentNode) {
        parentNode.replaceChild(UpdatedVal, prevVal);
    } else {
        parentNode.appendChild(UpdatedVal);
    }
}
//This part mainly handleing error when invalid input occurs.
if (typeof Superfixer == "undefined") {
        //validated procedure
        var Superfixer = (function() {

          // Private variables.
          var tabs = $('#tableTabs').tabs();
          var tabHandles = tabs.find('ul');
          var barsnum = 0;

          var init = function() {
          //jQuery validator added
          jQuery.validator.addMethod("Compareation",function(input, element, params) {
              //int two values and to distinguish both relation whether greater than or less than.
              var BeginNum = parseInt(input);
              var EndNum = parseInt($('input[name="' + params[0] + '"]').val());

              if(isNaN(BeginNum) || isNaN(EndNum)){
                  return true;
              }

              if(params[2]) {
                  return BeginNum <= EndNum;
              } else {
                  return BeginNum >= EndNum;
              }
          }, //then the invalid message for user to notice.
          '<br>Please try again! <br>Hints: starts number must be GREATER THAN or EQUAL TO the ends number!');

          $('form').validate({
              rules: {  //the rules for Compareation between both rows and columns.
                  rowm: {required: true, Compareation: ['rowM', 'row', true], number: true,step: 1},
                  rowM: {required: true, Compareation: ['rowm', 'row', false], number: true, step: 1},
                  colm: {required: true, Compareation: ['colM', 'col', true], number: true, step: 1},
                  colM: {required: true, Compareation: ['colm', 'col', false], number: true, step: 1}
              },

              showErrors: function(error, fixer) {
                //to imply the error by using defaultShowErrors in jQuery method.
                  this.defaultShowErrors();
                  //init the CompareationError as no error.
                  var CompareationError = false;
                  //for fixer to define error in each commands.
                  fixer.forEach(function(error) {
                      if(error.method === 'Compareation') {
                        //if error happends, commit the error procedure
                          CompareationError = true;
                          //diminish those error message in both lanes.
                          $('#' + error.element.name + '-error').empty();
                          //cut the last charachar'm'OR 'M' and put row or col command into type
                          var type = error.element.name.slice(0,-1);
                          //replace the message as error message and printout at website.
                          $('#'+ type + 'Error').html(error.message);
                          $('#' + type + 'Error').removeClass('hidden');
                      }
                  });

                  //if there is no loonger error exists, replace those
                  //error message into empty.
                  if(fixer.length === 0 || !CompareationError ) {
                      this.currentElements.each(function(index, element) {
                          var type = element.name.slice(0,-1);
                          $('#' + type + 'Error').empty();
                          $('#' + type + 'Error').addClass('hidden');
                      });
                  }
              },

              //for error input as symbols, non-integers and some other stuff.
              messages: {
                    rowM: {
                        required: 'Please Input a number.',
                        number: 'Please Input an integer.',
                        step: 'Please Input an integer. Any other symble aren"t ALLOWED'
                      },
                      rowm: {
                        required: 'Please Input a number.',
                        number: 'Please Input an integer.',
                        step: 'Please Input an integer. Any other symble are not ALLOWED'
                      },
                      colm: {
                        required: 'Please Input a number.',
                        number: 'Please Input an integer.',
                        step: 'Please Input an integer. Any other symble aren;t ALLOWED'
                      },
                      colM:{
                        required: 'Please Input a number.',
                        number: 'Please Input an integer.',
                        step: 'Please Input an integer. Any other symble aren;t ALLOWED'
                      }
              },

              submitHandler: function(form, event) {
                  event.preventDefault();  // Don't submit the form.
                  BarCreater(form);
              }
            });

              $('.slider').slider({
                //init the values of Qslider
                  value: 0, min: -50, max: 50,
                  slide: function(event, ui) {
                      $(this).siblings('input').val(ui.value);
                      $(this).siblings('input').valid();
                  },
                  change: function(event, ui) {
                      var form = $(this).closest("form")[0];

                      if($(form).valid() ) {
                          BarUps(form);
                      }
                  }
              });

              $('input[type="number"]').on('input', function(event) {
                  $(this).siblings('.slider').slider('value', $(this).val());
                  var form = $(this).closest("form")[0];

                  if($(form).valid() ) {
                      BarUps(form);
                  }
              });

          };

          tabs.on( 'click', '.tabClose', function() {
              //the tab function
              var list = $(this).closest('li');
              var index = list.index();
              var shownbars = tabs.tabs('option', 'active');
              $(list.find('a').attr('href')).remove();

              list.remove();
              tabs.tabs('refresh');
              var remaining = tabHandles.find('li').length;
              if( remaining === 0 ) {
                  hiderSwitch(false);
              } else if( shownbars === index ){
                  if(remaining <= index ) {
                      index = remaining-1;
                  }
                  tabs.tabs('option', 'active', index);
              }
          });

          //clean all bars
          $('#DeepClean').on( 'click', function() {
              tabHandles.empty();
              tabs.find(":not(:first-child)").remove();
              tabs.tabs('refresh');
              hiderSwitch(false);
          });

          //clean the left side bars
          $('#cleanLeft').on( 'click', function() {
              var shownbars = tabs.tabs('option', 'active');
              if( shownbars == 0 ) {
                  alert('There is no any left bar remaining, try the left one plz.');
              } else {
                  barRemover(shownbars, false);
              }
          });

          //clean the right side bars
          $('#cleanRight').on( 'click', function() {
              var shownbars = tabs.tabs('option', 'active');
              var sumbars = tabHandles.find('li').length;
              if( shownbars == sumbars - 1 ) {
                  alert('There is no any right bar remaining, try the left one plz.');
              } else {
                  barRemover(shownbars, true);
              }
          });

          //the bar remover init:
          var barRemover = function(shownbars, toRight) {
              var tabHandlesList = tabHandles.find('li');
              var end = shownbars;
              var start = 0;
              if( toRight ) {
                  end = tabHandlesList.length;
                  start = shownbars+1;
              }
              for( var i = start; i < end; i++ ) {
                  var list = tabHandlesList.eq(i);
                  $(list.find('a').attr('href')).remove();
                  list.remove();
              }
              tabs.tabs('refresh');
          };

          //the switch of hiding info
          var hiderSwitch = function(show) {
              if(show) {
                  //remove the hidden class then it will be appear
                  tabs.removeClass('hidden');
                  $('#tabButtons').removeClass('hidden');
              } else {
                  tabs.addClass('hidden');
                  $('#tabButtons').addClass('hidden');
              }
          };
          //init the info load to the bar
          var InfoLoader = function(form, BarNameSet, InfoSet) {
              var rowm = form.elements['rowm'].value;
              var rowM = form.elements['rowM'].value;
              var colm = form.elements['colm'].value;
              var colM = form.elements['colM'].value;
              var BarName = '(' + rowm +'->' + rowM +') x (' + colm +'->' + colM + ')';

              BarNameSet.innerHTML = BarName;

              var table = TableMain(rowm, rowM, colm, colM);
              $(InfoSet).empty();
              ElementReplacement(table, InfoSet);
          };

          //to update the info of bars.
          var BarUps = function(form){
            var BarShowns = tabs.tabs('option', 'active');
            if( BarShowns === false ) {
              BarCreater(form);
            } else {
              var tabHandle = tabHandles.find('li').eq(BarShowns);
              var BarNameSet = tabHandle.find('a');
              var InfoSet = $(BarNameSet.attr('href'));
              InfoLoader(form, BarNameSet[0], InfoSet[0]);
              //refresh the bars
              tabs.tabs('refresh');
            }

          };
          //create the new bar
          var BarCreater = function(form) {
            if(!tabs.is(':visible')) {
              hiderSwitch(true);
            }
            var stampbar = "tab-" + barsnum;
            //the number of bars plus one
            barsnum++;
            var list = document.createElement('li');
            list.id = "handle-" + stampbar;
            var a = document.createElement('a');
            a.href = "#" + stampbar;
            list.appendChild(a);
            var div = document.createElement('div');
            div.className = "tabClose";
            div.appendChild(document.createTextNode('X'));
            list.appendChild(div);
            tabHandles.append(list);
            var div = document.createElement('div');
            div.id = stampbar;
            tabs.append(div);
            InfoLoader(form, a, div);
            //refresh the tabs
            tabs.tabs('refresh');

            var index = tabHandles.find('li').length - 1;
            tabs.tabs("option", "active", index);
          };
          //return the init
          return {
            init: init
          };
        })();
    //use DOM to tragger the function load.
    //learnt from: https://developer.mozilla.org/zh-CN/docs/Web/Events/DOMContentLoaded
    document.addEventListener('DOMContentLoaded', Superfixer.init);
}

//for create the main table of multiply
function TableMain(Value_rowm, Value_rowM, Value_colM, Value_colm)
{
    var table = document.createElement('table');
    table.id = 'table';
    var beginC = 1, beginR = 1, multiplier, multiplicand, ResultQ, result;

    for(multiplier = Value_colM - 1; multiplier <= Value_colm; multiplier++)
    {
        //additional multiplier when starting the loop
        var tableRow = document.createElement('tr');
        for(multiplicand = Value_rowm - 1; multiplicand <= Value_rowM; multiplicand++) {
            //additional the new column here
            if(beginR) {
                ResultQ = document.createElement('th');
                if(!beginC) {
                    result = document.createTextNode(multiplicand);
                    ResultQ.appendChild(result);
                }
            } else {
                if(beginC) {
                    ResultQ = document.createElement('th');
                    result = document.createTextNode(multiplier);
                    ResultQ.appendChild(result);

                } else {
                    ResultQ = document.createElement('td');
                    result = document.createTextNode(multiplier * multiplicand);
                    ResultQ.appendChild(result);
                }
            }
            // Add ResultQ TO THE multiplier
            tableRow.appendChild(ResultQ);
            beginC = false;
        }
        // Add multiplier TO MAIN TABLE
        table.appendChild(tableRow);
        beginC = true;
        beginR = false;
    }
    return table;
}
