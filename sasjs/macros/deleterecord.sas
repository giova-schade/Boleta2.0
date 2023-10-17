/**
  @file
  @brief <Your brief here>

  <h4> SAS Macros </h4>
  @li viewrecord.sas

**/
%macro DeleteRecord(GRP_CODIGO);
  proc sql;
    delete from BESASGC.BE_LOG_EVENTO where GRP_CODIGO = compress("&GRP_CODIGO");
    delete from BESASGC.BE_CONTROL_PROCESO where GRP_CODIGO = compress("&GRP_CODIGO");
    delete from BESASGC.BE_VALIDA_GRUPO where GRP_CODIGO = compress("&GRP_CODIGO");
    delete from BESASGC.BE_GRUPO_ATRIBUTO where GRP_CODIGO = compress("&GRP_CODIGO");
    delete from BESASGC.BE_GRUPO_CONTROL where GRP_CODIGO = compress("&GRP_CODIGO");
  quit;
  %ViewRecord(tabla=BE_GRUPO_CONTROL,reg=)
%mend DeleteRecord;