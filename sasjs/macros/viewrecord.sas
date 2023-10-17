/**
  @file
  @brief <Your brief here>
  <h4> SAS Macros </h4>
**/
%macro ViewRecord(tabla=, reg=);
%put muesto los registros;
%if %length(&reg) ne 0 %then %do;
proc sql ;
create table response_TEMP as
    select distinct t1.* , put (max(t2.PROC_DATE_PROCESO), datetime16.) as PROC_DATE_PROCESO , t2.PROC_CANT_REGISTROS
    from BESASGC.&tabla. t1
    left join BESASGC.BE_CONTROL_PROCESO t2 on (t1.GRP_CODIGO eq t2.GRP_CODIGO)
where t1.GRP_CODIGO="&reg"
group by t1.GRP_CODIGO;
quit;
%end;
%else %do;
DATA response_TEMP;
SET BESASGC.&tabla.;
RUN;
%end;


DATA response (RENAME=(TXT_HABILITADO=GRP_HABILITADO TXT_PERIOCIDAD=GRP_PERIOCIDAD txt_VERSION=GRP_VERSION ));
SET response_TEMP;
format GRP_VIGENCIA_FIN ddmmyy10. ;
format grp_vigencia_inicio ddmmyy10.;
FORMAT GRP_DATE_CREADO NLDATMAP32. ;
FORMAT GRP_DATE_MODIFICADO NLDATMAP32. ;
length TXT_PERIOCIDAD $32;
length TXT_HABILITADO $32;
grp_vigencia_inicio = datepart(grp_vigencia_inicio);
GRP_VIGENCIA_FIN = datepart(GRP_VIGENCIA_FIN);
GRP_ESQUEMA_VALIDO = "";
if GRP_HABILITADO eq 1 then do;
    TXT_HABILITADO = "Habilitado";
end;
else if GRP_HABILITADO eq 0 then do;
    TXT_HABILITADO = "Deshabilitado";
end;

if GRP_PERIOCIDAD eq 0 then do;
    TXT_PERIOCIDAD = "No definida";
end;
else if GRP_PERIOCIDAD eq 1  then do;
    TXT_PERIOCIDAD = "Diaria";
end;
else if GRP_PERIOCIDAD eq 2  then do;
    TXT_PERIOCIDAD = "Semanal";
end;
else if GRP_PERIOCIDAD eq 3  then do;
    TXT_PERIOCIDAD = "Mensual";
end;
else if GRP_PERIOCIDAD eq 4  then do;
    TXT_PERIOCIDAD = "Otra";
end;
txt_VERSION = put(GRP_VERSION,5.2);
drop GRP_HABILITADO;
drop GRP_PERIOCIDAD;
drop GRP_VERSION;
RUN;

proc sql noprint;
select count (*) into :countresponse from response;
quit;

%mp_abort(iftrue= (&countresponse eq 0)
  ,mac=&_program
  ,msg=%str(No hay segmentos creados)
)



%mend ViewRecord;