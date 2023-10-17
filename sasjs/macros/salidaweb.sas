/**
  @file
  @brief <Your brief here>
  <h4> SAS Macros </h4>
**/

%macro SalidaWeb(Tabla=);
/*Envió el resultado por json*/
    %if "&output" eq "json" %then %do;
       proc sql noprint;
            select count(*) into :vcount from WORK.&Tabla. ;
        quit;
        %put ------------->&vcount;
        %if &vcount ne 0 %then %do;
            filename json_m temp encoding='utf-8';
                proc json out=json_m pretty nosastags NOFMTCHARACTER NOSCAN ;
                    write open object;
                    write values "respuesta";
                    write open array;
                    export WORK.&Tabla.;
                    write close;
                    write close;
                run;

                data _null_;
                    infile json_m;
                    file _webout;
                    input;
                    put _infile_;
                run;
        %end;
    %end;
    %else %if "&output" eq "Tabla" %then %do;
        %STPBEGIN;
        proc print data=&tabla; run;
        %STPEND;
    %end;
%mend SalidaWeb;