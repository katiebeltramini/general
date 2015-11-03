//function looks at a range of taskids and dependencies and writes out the subdependencies
function blockercount() {
    // Define an input range with values of taskids and dependencies
    var test_range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Script Test - V2 Softlaunch").getRange("D9:E74");
    // Pass the input range as an argument to function "getDependencies()" and capture its return object (mapping of taskids and dependencies)
    var dependencies = getDependencies(test_range);
    // Create a range object of one cell in the new sheet for output.
    var output_range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Script Test - V2 Softlaunch").getRange("J9");
    // Set a row counter for output.
    var row_counter = 0;
    //go through each of the taskids
    var sub_counter = 0; //to track number of subdependencies and to try and break if it is an issue
    for  (var key in dependencies ) {
        var value_dependencies = dependencies[key];
        output_range.offset(row_counter, 0).setValue(key);  
        var read_col = 1;  //track which columns have been read
        var write_col = 1;  //track which columns have been written to
      if ((value_dependencies != 0)||(value_dependencies != "")) {   //don't look up dependencies if these values are in the column.
             writeDependencies(value_dependencies, row_counter, write_col, output_range);
             while (output_range.offset(row_counter,read_col).getValue()!= "") {  //while the value of the column to be read is not empty
               value_dependencies = dependencies[output_range.offset(row_counter,read_col).getValue()];  //get the value of the depencency and look up if it has dependenciies
               while(output_range.offset(row_counter,write_col).getValue()!= "") {  
                 write_col++;  //increment the column column counter - check how many columns until empty
                  }
               if (value_dependencies != 0) {
                   writeDependencies(value_dependencies, row_counter, write_col, output_range);  //write out dependencies that were looked up
                   sub_counter++;
                    if(sub_counter>50){
                      output_range.offset(row_counter, write_col).setValue("ERROR - POTENTIAL CIRCULAR REFERENCE"); //Assumption - if over 50 dependencies, there is a circular reference issue
                      break;
                    }
              } else {
                 output_range.offset(row_counter, write_col).setValue(0);  //set dependencies to 0 otherwise
              }
              read_col++;  //increment column counter
             }
           
         } else {
                output_range.offset(row_counter, write_col).setValue(0);  //set dependencies to 0 otherwise
         }
      row_counter++;      //increment row counter

        
    }   

}
 

//function for creating a mapping of tasks and dependencies for a given range and storing it
function getDependencies(range) {
      // Create an object to store the unique taskids and their dependencies
      var dependencies = {};
      var row_counter = 0;
      for( var i = 1; i <= range.getNumRows(); i++ ) {
           var cell_value = range.offset(row_counter,0).getValue();
           dependencies[cell_value]  = range.offset(row_counter,1).getValue();
           row_counter++;
        
        }      
    return dependencies;  //returns mapping
}

//IMPROVEMENT WOULD BE TO NOT WRITE IF ALREADY WRITTEN BEFORE

//function for writing out the list of dependencies for a task 
function writeDependencies(value_dependencies, row_counter, col_counter, output_range) {
  if (value_dependencies.indexOf(",") == -1)  //if there is no commas
  {
      output_range.offset(row_counter, col_counter).setValue(value_dependencies);             
  } else {
     var dependencies_array = value_dependencies.split(",");  //splits of tasks by ,
     for (var n=0; n < dependencies_array.length; n++)
     {
        output_range.offset(row_counter, col_counter+n).setValue(dependencies_array[n]);
     }             
  }  
}



function countBlockers(){
  var range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Script Test - V2 Softlaunch").getRange("J9:Z74");
  var block_count;
  var blocker;
  var cell_value;
  var num_tasks;
  var row_counter;
  var column_counter;
  var done_range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Script Test - V2 Softlaunch").getRange("C9:C74");
  var output_range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Script Test - V2 Softlaunch").getRange("G9");
  for(num_tasks=0; num_tasks < range.getNumRows(); num_tasks++) {
    block_count = 0;
    test: for (row_counter=0; row_counter < range.getNumRows(); row_counter++) {
      for(column_counter=1; column_counter < range.getNumColumns(); column_counter++) {
        blocker = range.offset(num_tasks,0).getValue();
        cell_value = range.offset(row_counter, column_counter).getValue();
        if(blocker == cell_value){
          block_count++; 
          break test;
        }
      }  
    }
     if(done_range.offset(num_tasks, 0).getValue() != "Done"){
        output_range.offset(num_tasks,0).setValue(block_count);
      }  else {
        output_range.offset(num_tasks,0).setValue("Done");
      }
    
  }
}
