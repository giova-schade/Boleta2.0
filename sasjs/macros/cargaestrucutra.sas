/**
  @file
  @brief <Your brief here>
  <h4> SAS Macros </h4>
**/

%macro cargaEstrucutra(_programa=);
    /*creo tabla de parametros*/
    %if %sysfunc(exist(CFGJSON.fields)) %then
        %do;
            %if %sysfunc(exist(CFGJSON.fields)) %then
                %do;
                    proc sql;
                        create table parametrosTemp as
                            select "&_programa" as GRP_CODIGO,
                                upcase(name) as ATR_NOMBRE ,
                                upcase(type) as ATR_VALOR,
                                0 as ATR_PARAM
                            from CFGJSON.fields
                                where name ne 'parametros'
                                    union
                                select "&_programa" as GRP_CODIGO,
                                    upcase(name) as ATR_NOMBRE ,
                                    upcase(type) as ATR_VALOR,
                                    1 as ATR_PARAM
                                from CFGJSON.ELEMENTTYPE_FIELDS
                                    where name ne 'parametros';
                    quit;

                %end;
            %else
                %do;

                    proc sql;
                        create table parametrosTemp as
                            select "&_programa" as GRP_CODIGO,
                                upcase(name) as ATR_NOMBRE ,
                                upcase(type) as ATR_VALOR,
                                0 as ATR_PARAM
                            from CFGJSON.fields where name ne 'name';
                    quit;

                %end;
        %end;
    %else
        %do;
            %put error al cargar el archivo json;

            %return;
        %end;

    %if %sysfunc(exist(parametrosTemp)) %then
        %do;
            /*homologo tipos de datos*/
            PROC SQL;
                delete from BESASGC.BE_GRUPO_ATRIBUTO where GRP_CODIGO =  "&_programa";
                CREATE TABLE parametros AS
                    SELECT T1.GRP_CODIGO ,
                        T1.ATR_NOMBRE,
                        (
                    CASE
                        WHEN T2.SAS_DATA_TYPE NE '' THEN T2.SAS_DATA_TYPE
                        ELSE T3.SAS_DATA_TYPE
                    END
                            )
                        AS ATR_VALOR ,
                        ATR_PARAM
                            FROM parametrosTemp T1
                                LEFT JOIN DICCIONARIOSAS T2 ON (T2.CampoOrigen  EQ T1.ATR_VALOR AND T2.Motor = 'IMPALA')
                                LEFT JOIN DICCIONARIOSAS T3 ON (T3.CampoOrigen  EQ T1.ATR_VALOR AND T3.Motor = 'HIVE')
                ;

            QUIT;
            proc sql;
                    insert into BESASGC.BE_GRUPO_ATRIBUTO  (GRP_CODIGO, ATR_NOMBRE , ATR_VALOR , ATR_PARAM) select GRP_CODIGO, ATR_NOMBRE , ATR_VALOR , ATR_PARAM from parametros;
                drop table parametrosTemp;
                drop table parametros;
            quit;

            libname CFGJSON clear;
        %end;
    %else
        %do;
            %put error al cargar el archivo json;

            %return;
        %end;

    /**/
%mend cargaEstrucutra;