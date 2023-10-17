/**
  @file
  @brief <Your brief here>
  <h4> SAS Macros </h4>
**/
%macro increasesVersionValida(GRP_CODIGO=);
%local V_GRP_VERSION;
proc sql noprint;
select t2.descripcion , t1.GRP_ESTADO, GRP_VERSION   into :VLD_DIRECTORIO trimmed , :VLD_ESTADO trimmed , :V_GRP_VERSION
from BESASGC.BE_GRUPO_CONTROL t1
left join Boleta_Config t2 on ( t1.GRP_PERIOCIDAD eq  input(t2.value, 10.) and t2.name='GRP_PERIOCIDAD')
where GRP_CODIGO="&GRP_CODIGO";
quit;
%put &VLD_DIRECTORIO &VLD_ESTADO &V_GRP_VERSION;
proc sql;
insert into BESASGC.BE_VALIDA_GRUPO (
GRP_CODIGO,
VLD_FILENAME,
VLD_DIRECTORIO,
VLD_USER_CREADO,
VLD_ESTADO,
VLD_VERSION
)
values(
"&GRP_CODIGO",
"",
"&VLD_DIRECTORIO",
"&_METAPERSON",
&VLD_ESTADO.,
&V_GRP_VERSION.
);
quit;
%mend increasesVersionValida;