/**
  @file
  @brief REFACTOR
  @details Is this still necessary?  In SASjs, inputs arrives as work datasets.

  <h4> SAS Macros </h4>
**/
%macro validoSchema(json=);
    %let wpath = %sysfunc(pathname(work));
    %put &wpath;
    filename jsonFile "&wpath./estructura.json";
    data _null_;
        file jsonFile;
        put &json;
    run;
    filename mytmp pipe "cat &wpath./estructura.json | python -m json.tool | grep 'Expecting object:'";
    data _null_;
      length buffer $200;
      infile mytmp dlm="¬";
      input buffer;
      call symput('ErrorEsquema' ,  buffer);
    run;


%mend validoSchema;