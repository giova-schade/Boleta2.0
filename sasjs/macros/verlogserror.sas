/**
  @file
  @brief REFACTOR
  @details should avoid use of XCMD.  Check out: mp_dirlist
  https://core.sasjs.io/mp__dirlist_8sas.html

  <h4> SAS Macros </h4>
  @li messagebe.sas
**/

%macro VerLogsError();
%LOCAL TOTALESEGE;
filename mypipe pipe "ls -1 /sasdatad/apps/be/nominas/programs/semanal/*.sas /sasdatad/apps/be/nominas/programs/mensual/*sas /sasdatad/apps/be/nominas/programs/diario/*sas 2>/dev/null | xargs -I {} basename {} ";
data segmentosFail;
infile mypipe;
    length salida_bash $300;
    input salida_bash ;
    salida_bash = tranwrd(upcase(salida_bash),'.SAS','');
run;
filename mypipe clear;


PROC SQL NOPRINT;
SELECT COUNT (*) INTO :TOTALESEGE FROM segmentosFail ;
QUIT;

%IF %LENGTH(&TOTALESEGE) NE 0 %THEN %DO;
proc sql;
create table RESULT as select t2.GRP_NOMBRE , t1.*
from BESASGC.BE_LOG_EVENTO t1
left join BESASGC.BE_GRUPO_CONTROL t2 on(t1.GRP_CODIGO eq t2.GRP_CODIGO)
WHERE T1.GRP_CODIGO IN (SELECT T4.salida_bash FROM segmentosFail T4  );
quit;
%END;
%ELSE %DO;
 %MESSAGEBE("No se pudo cargar el log");
%END;
%mend VerLogsError;