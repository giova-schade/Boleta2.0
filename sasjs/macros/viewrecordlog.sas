/**
  @file
  @brief <Your brief here>
  <h4> SAS Macros </h4>
**/
%macro ViewRecordLog(tabla=);
%put muestro los registros  del log ;
proc sql ;
create table response as
    select *
    from BESASGC.&tabla. order by LOG_UID;
quit;
%SalidaWeb(Tabla=response);
%mend ViewRecordLog;
%macro ViewRecordLogTmp(tabla=);
%put muestro los registros  del log ;
proc sql ;
create table response as
    select *
    from &tabla. order by LOG_UID;
quit;
%SalidaWeb(Tabla=response);
%mend ViewRecordLogTmp;