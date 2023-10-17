/**
  @file
  @brief <Your brief here>
  <h4> SAS Macros </h4>
**/
%macro InsertEvent(GRP_CODIGO,LOG_EVENTO,LOG_USUARIO,LOG_TIPO_EVENTO);
data _null_;
    p_fecha=datetime();
    call symputx('fecha_proc',p_fecha);
run;

proc sql noprint;
insert into BESASGC.BE_LOG_EVENTO (
    GRP_CODIGO,
    LOG_EVENTO,
    LOG_DATETIME,
    LOG_USUARIO,
    LOG_TIPO_EVENTO
  )
  values(
    &GRP_CODIGO,
    &LOG_EVENTO,
    &fecha_proc,
    &LOG_USUARIO,
    &LOG_TIPO_EVENTO
  );
quit;
%mend InsertEvent;