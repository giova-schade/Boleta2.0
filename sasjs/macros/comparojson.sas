/**
  @file
  @brief <Your brief here>
  <h4> SAS Macros </h4>
**/
%macro comparoJson(GRP_ESQUEMA_VALIDO=,GRP_CODIGO=);

%let pwdpath = %sysfunc(pathname(work));
    data _null_;
        file "&pwdpath/json1.json";
        json = &GRP_ESQUEMA_VALIDO;
        put json;
        file print;
    run;

    data _null_;
        file "&pwdpath/json2.json";
        set BESASGC.BE_GRUPO_CONTROL (where=(GRP_CODIGO="&GRP_CODIGO"));
        put GRP_ESQUEMA_VALIDO;
        file print;
    run;

    x "cat &pwdpath/json1.json | python -m json.tool >  &pwdpath/jsonCompare1.json";
    x "cat &pwdpath/json2.json | python -m json.tool >  &pwdpath/jsonCompare2.json";

    filename mytmp pipe "diff &pwdpath/jsonCompare1.json &pwdpath/jsonCompare2.json | wc -l";

    data _null_;
        length buffer $200.;
        infile mytmp dlm="¬";
        input buffer;
        call symput('ESQUEMA_VALIDO_CHANGE',compress(input(buffer,10.)));
    run;

%mend comparoJson;