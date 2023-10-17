/**
  @file
  @brief <Your brief here>
  <h4> SAS Macros </h4>
**/
%macro increasesVersion(GRP_CODIGO=);

proc sql noprint;
select (GRP_VERSION + 0.01) into :N_GRP_VERSION  from BESASGC.BE_GRUPO_CONTROL where GRP_CODIGO ="&GRP_CODIGO" ;
quit;
proc sql;
update  BESASGC.BE_GRUPO_CONTROL  set GRP_VERSION=&N_GRP_VERSION where GRP_CODIGO ="&GRP_CODIGO";
quit;
%mend increasesVersion;