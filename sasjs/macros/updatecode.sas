/**
  @file
  @brief <Your brief here>
  <h4> SAS Macros </h4>
**/
%macro UpdateCode ;
LIBNAME BLTCOD BASE "/sasdatad/apps/be/nominas/data";
proc sql ;
DELETE FROM BLTCOD.CODIGOS;
INSERT INTO BLTCOD.CODIGOS (GRP_CODIGO) SELECT GRP_CODIGO FROM BESASGC.BE_GRUPO_CONTROL;
quit;
%mend UpdateCode;