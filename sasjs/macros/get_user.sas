/**
  @file
  @brief NEEDS REFACTOR

  <h4> SAS Macros </h4>
**/
%macro get_user(_user=,_tabla=, role_=);

    proc json out = _webout pretty nosastags ;
        write open object;
        write values "role" "&role_";
        write values "Nombre" &_user;
        write values "info";
        write open object;

        write close;
        write close;
    run;

%mend get_user;