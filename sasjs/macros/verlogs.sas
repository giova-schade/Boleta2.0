/**
  @file
  @brief <Your brief here>

  <h4> SAS Macros </h4>
  @li messagebe.sas
  @li where.sas

**/

%macro VerLogs();
%let where =;

%if %length(&FECHALOGS_MAX) ne 0  and %length(&FECHALOGS_MIN) ne 0 %then
    %do;
        %let where =where datepart(LOG_DATETIME) between "&FECHALOGS_MIN"d and  "&FECHALOGS_MAX"d;
    %end;
%ELSE %IF %length(&FECHALOGS_MAX) ne 0  and %length(&FECHALOGS_MIN) EQ 0 %then
    %do;
        %let where= %str(where datepart(LOG_DATETIME)  = "&FECHALOGS_MAX"d );
    %END;
%ELSE %IF %length(&FECHALOGS_MAX) eq 0  and %length(&FECHALOGS_MIN) NE  0 %then
    %do;
        %let where= %str(where datepart(LOG_DATETIME)  = "&FECHALOGS_MIN"d );
    %END;

%if %length(&UsuarioLogs) and "&UsuarioLogs" ne "undefined"  %then
    %do;
        %if %length(&where) ne 0 %then
            %do;
                %let where= %str(&where and LOG_USUARIO = "&UsuarioLogs" );
            %end;
        %else
            %do;
                %let where= %str(where  LOG_USUARIO = "&UsuarioLogs" );
            %end;
    %end;

%if %length(&GRP_CODIGO) and "&GRP_CODIGO" ne "undefined" %then
    %do;
        %if %length(&where) ne 0 %then
            %do;
                %let where= %str(&where and t1.GRP_CODIGO = "&GRP_CODIGO" );
            %end;
        %else
            %do;
                %let where= %str(where  t1.GRP_CODIGO = "&GRP_CODIGO" );
            %end;
    %end;
proc sql;
create table RESULT as select t2.GRP_NOMBRE , t1.*
from BESASGC.BE_LOG_EVENTO t1
left join BESASGC.BE_GRUPO_CONTROL t2 on(t1.GRP_CODIGO eq t2.GRP_CODIGO)
&where;
quit;

proc sql noprint;
select count(*) into :totalLog from RESULT;
quit;
%if &totalLog eq 0 %then %do;
 %MESSAGEBE("No hay registros");
%end;
%mend VerLogs;