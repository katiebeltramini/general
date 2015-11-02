//Need to figure out how to handle empty rows
//need to break if circular reference
//better if printed in existing sheet vs. new sheet
//figure out how to run updates 
//improve comments and variable names

function blockercount() {
    // Define an input range with values of some kind in it.
    var test_range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Script Test - V2 Softlaunch Todo").getRange("D9:E74");
    // Pass the input range as an argument to function "getCountValues()" and
   // capture its return object.
    var dependencies = getDependencies(test_range);
    // Add a new sheet for output and store a reference to the sheet object object.
    var new_sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Dependency and Blocking Results");
   // var result_range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("output6").getRange("A1:Z300");
    // Create a range object of one cell in the new sheet for output.
    var output_range = new_sheet.getRange("A1");
    // Set a row counter for output.
    var row_counter = 0;
    for  ( var key in dependencies ) {
        var value_dependencies = dependencies[key];
        output_range.offset(row_counter, 0).setValue(key);  
        var read_col = 1;
        var write_col = 1;
        if (value_dependencies != 0) {
             writeDependencies(value_dependencies, row_counter, write_col, output_range);
             while (output_range.offset(row_counter,read_col).getValue()!= "") {
               value_dependencies = dependencies[output_range.offset(row_counter,read_col).getValue()];
               while(output_range.offset(row_counter,write_col).getValue()!= "") {
                 write_col++;
                  }
               if (value_dependencies != 0) {
                   writeDependencies(value_dependencies, row_counter, write_col, output_range);                   
              } else {
                 output_range.offset(row_counter, write_col).setValue(0);
              }
              read_col++;
             }
           
         } else {
                output_range.offset(row_counter, write_col).setValue(0);
         }
      row_counter++;      
    }   

}
 
function getDependencies(range) {
      // Create an object to store the unique taskids and their dependencies
      var dependencies = {};
      var row_counter = 0;
      for( var i = 1; i <= range.getNumRows(); i++ ) {
           var cell_value = range.offset(row_counter,0).getValue();
           dependencies[cell_value]  = range.offset(row_counter,1).getValue();
           row_counter++;
        
        }      
    return dependencies;  
}

function writeDependencies(value_dependencies, row_counter, col_counter, output_range) {
  if (value_dependencies.indexOf(",") == -1)
          {
            output_range.offset(row_counter, col_counter).setValue(value_dependencies);             
          } else {
            var dependencies_array = value_dependencies.split(",");
            for (var n=0; n < dependencies_array.length; n++)
            {
                 output_range.offset(row_counter, col_counter+n).setValue(dependencies_array[n]);
            }             
          }  
}
