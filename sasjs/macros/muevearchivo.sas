/**
  @file
  @brief REFACTOR
  @details It's bad practice to use XCMD
  Try this macro instead: mp_binarycopy.sas
  <h4> SAS Macros </h4>
**/

%macro MueveArchivo(pathOrigen=,pathdestino=,GRP_CODIGO=);
%let mueve=ok;
%put mv /sasdatad/apps/be/nominas/scheduler/&pathdestino./version/%nrquote(*)grpctl_01.sas  /sasdatad/apps/be/nominas/scheduler/&pathOrigen./version/;
%if %sysfunc(fileexist("/sasdatad/apps/be/nominas/programs/&pathdestino./&GRP_CODIGO..sas")) or
    %sysfunc(fileexist("/sasdatad/apps/be/nominas/scheduler/&pathdestino./&GRP_CODIGO..sas"))
        %then %do;
    /*cambio los programas del usuario*/
        %sysexec %str(mv /sasdatad/apps/be/nominas/programs/&pathdestino./&GRP_CODIGO..sas  /sasdatad/apps/be/nominas/programs/&pathOrigen./);
    /*cambio los programas del scheduler*/
        %sysexec %str(mv /sasdatad/apps/be/nominas/scheduler/&pathdestino./&GRP_CODIGO..sas  /sasdatad/apps/be/nominas/scheduler/&pathOrigen./);
    /*cambio las versiones del programa*/
        %sysexec %str(mv /sasdatad/apps/be/nominas/scheduler/&pathdestino./version/&GRP_CODIGO.%nrquote(*).sas  /sasdatad/apps/be/nominas/scheduler/&pathOrigen./version/);
    %let mueve=ok;
%end;
%else %Do;
    %let mueve=nook;
%End;
%mend MueveArchivo;