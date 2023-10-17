/**
  @file
  @brief <Your brief here>
  <h4> SAS Macros </h4>
**/







%macro main(GRP_CODIGO=);


%if "&ACTION" EQ "NewRecord" %THEN %DO;
    %IF %LENGTH(&GRP_CODIGO) NE 0 %THEN %DO;
        proc sql noprint;
        select count(*) into :CBE_GRUPO_CONTROL from BESASGC.BE_GRUPO_CONTROL where GRP_CODIGO="&GRP_CODIGO";
        quit;
        %if &CBE_GRUPO_CONTROL eq 0 %then %do;
            %NewRecord;
            %UpdateCode;
        %end;
        %else %do;
            %MESSAGEBE("El código &GRP_CODIGO ya existe!");
            %SalidaWeb(Tabla=RESULT);
        %end;

    %END;
    %ELSE %DO;
        %MESSAGEBE("Debe ingresar un código de segmento ");
        %SalidaWeb(Tabla=RESULT);
    %END;
    /* response comes from viewrecord */
    %webout(OPEN)
    %webout(obj,response)
    %webout(CLOSE)

%END;
%ELSE %IF "&ACTION" EQ "UpdateRecord" %THEN %DO;
    %IF %LENGTH(&GRP_CODIGO) NE 0 %THEN %DO;
        proc sql noprint;
        select count(*) into :CBE_GRUPO_CONTROL from BESASGC.BE_GRUPO_CONTROL where GRP_CODIGO="&GRP_CODIGO";
        quit;
        %if &CBE_GRUPO_CONTROL ne 0 %then %do;
            %UpdateRecord;

        %end;
        %else %do;
            %MESSAGEBE("El código &GRP_CODIGO No existe!");
            %SalidaWeb(Tabla=RESULT);
        %end;
    %END;
    %ELSE %DO;
        %MESSAGEBE("Debe ingresar un código de segmento ");
        %SalidaWeb(Tabla=RESULT);
    %END;

    /* response comes from viewrecord */
    %webout(OPEN)
    %webout(obj,response)
    %webout(CLOSE)

%END;
%ELSE %IF "&ACTION" EQ "UpdateCode" %THEN %DO;
    %UpdateCode;
    %MESSAGEBE("Codigos actualizados");
    %SalidaWeb(Tabla=RESULT);

%END;
%ELSE %IF "&ACTION" EQ "ViewRecord" %THEN  %DO;
     %if %length(&GRP_CODIGO) ne 0 %then %do;
        %let mensaje = "El código &GRP_CODIGO ha sido consultado";
            %InsertEvent(GRP_CODIGO="&GRP_CODIGO",
            LOG_EVENTO=&mensaje,
            LOG_USUARIO="&_METAPERSON",
            LOG_TIPO_EVENTO="001");
     %end;

    %ViewRecord(tabla=BE_GRUPO_CONTROL,reg=&GRP_CODIGO);
    %webout(OPEN)
    %webout(obj,response)
    %webout(CLOSE)
%END;
%ELSE %IF "&ACTION" EQ "Start" %THEN  %DO;
    %include "/sasdatad/apps/be/nominas/deploy/valida_programa.sas";
    proc sql noprint;
        select count(*) into :log from BESASGC.BE_LOG_EVENTO where LOG_TIPO_EVENTO = "007";
         select count(*) into :logTotal from BE_LOG_EVENTO;
    quit;
    %put log:&log;
      %put logTotal:&logTotal;
    %if &log eq 0 %then %do;
         %MESSAGEBE("No se encontraron archivos a procesar.");
         %SalidaWeb(Tabla=RESULT);
    %end;
    %else %do;
        %if &logTotal eq 0 %then %do;
            %MESSAGEBE("No se encontraron archivos a procesar.");
            %SalidaWeb(Tabla=RESULT);
            %end;
        %else %do;
            %ViewRecordLogTmp(tabla=BE_LOG_EVENTO);
        %end;
    %end;

%END;
%ELSE %IF "&ACTION" EQ "VerLogs" %THEN  %DO;
    %VerLogs();
    %SalidaWeb(Tabla=RESULT);
%END;
%ELSE %IF "&ACTION" EQ "VerLogsError" %THEN  %DO;
    %VerLogsError();
    %SalidaWeb(Tabla=RESULT);
%END;
%ELSE %IF "&ACTION" EQ "GRP_CODIGOS" %THEN  %DO;
    PROC SQL;
        CREATE TABLE RESULT  AS SELECT GRP_CODIGO FROM BESASGC.BE_GRUPO_CONTROL;
        select count (*) into :totalcode from RESULT ;
     quit;
     %if &totalcode eq 0 %then %do;
            %MESSAGEBE("No hay segmentos creados.");
     %end;
    %SalidaWeb(Tabla=RESULT);
%END;
%ELSE %IF "&ACTION" EQ "GetEsquema" %THEN  %DO;
    %IF %LENGTH(&GRP_CODIGO) NE 0 %THEN %DO;
      %let pwdpath = %sysfunc(pathname(work));

      data _null_;
      set BESASGC.BE_GRUPO_CONTROL (where=(GRP_CODIGO="&GRP_CODIGO."));
      file "&pwdpath/temporal.json";
      put GRP_ESQUEMA_VALIDO;
      run;

      x "cat &pwdpath/temporal.json | python -m json.tool > &pwdpath/setting.json";

      DATA _NULL_;
                  INFILE "&pwdpath/setting.json";
                  FILE _WEBOUT;
                  INPUT;
                  PUT _INFILE_;
      RUN;
    %END;
    %ELSE %DO;
        %MESSAGEBE("Debe ingresar un código de segmento ");
        %SalidaWeb(Tabla=RESULT);
    %END;
%END;
%mend main;