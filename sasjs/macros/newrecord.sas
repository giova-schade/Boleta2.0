/**
  @file
  @brief WORK NEEDED
  @details All the invoked macros need to be listed below

  <h4> SAS Macros </h4>
  @li validoschema.sas
  @li messagebe.sas
  @li salida.web.sas

**/
%macro NewRecord;

    %if %length(&GRP_ESQUEMA_VALIDO.) ne 0 %then %do;
        proc contents data=BESASGC.BE_GRUPO_CONTROL out=variables noprint; run;
        data _null_ ;
            set variables (where=(NAME='GRP_ESQUEMA_VALIDO'));
            CALL SYMPUT("LARGO_ESQUEMA", LENGTH);
        run;
        PROC SQL NOPRINT;
            SELECT COUNT(*) INTO :GRP_NOMBRE_EXIST FROM BESASGC.BE_GRUPO_CONTROL WHERE GRP_NOMBRE="&GRP_NOMBRE";
            DROP TABLE variables;
        QUIT;
            /*se vambia a distinto de 0 ya que en el futuro se debe cargar desde un archivo json */
        %IF %length(&GRP_ESQUEMA_VALIDO.) NE  0 %THEN %DO;
            %IF &GRP_NOMBRE_EXIST EQ 0 %THEN %DO ;
                %validoSchema(json="&GRP_ESQUEMA_VALIDO");
                %if %length(&ErrorEsquema) eq 0 %then %do;
                    libname CFGJSON JSON  fileref =jsonFile automap=replace;
                     data _null_;
                        p_fecha=datetime();
                        VIGENCIA_INICIO=input("&GRP_VIGENCIA_INICIO  0:00:00", datetime20.);
                        VIGENCIA_FIN=input("&GRP_VIGENCIA_FIN  0:00:00", datetime20.);
                        codigo = compress("&GRP_CODIGO");
                        call symputx('fecha_proc',p_fecha);
                        call symputx('GRP_CODIGO',codigo);
                        call symput('VIGENCIA_INICIO', VIGENCIA_INICIO);
                        call symput('VIGENCIA_FIN', VIGENCIA_FIN);
                    run;
                    proc sql  noprint;
                       insert into BESASGC.BE_GRUPO_CONTROL(
                                   GRP_CODIGO,
                                   GRP_NOMBRE,
                                   GRP_DESCRIPCION,
                                   GRP_HABILITADO,
                                   GRP_USER_CREADO,
                                   GRP_USER_MODIFICADO,
                                   GRP_VERSION,
                                               GRP_ESTADO,
                                   GRP_AREA_NEGOCIO,
                                   GRP_ESQUEMA_VALIDO,
                                   GRP_PERIOCIDAD,
                                   GRP_VIGENCIA_INICIO,
                                   GRP_VIGENCIA_FIN)
                    values (
                    "&GRP_CODIGO",
                    "&GRP_NOMBRE",
                    "&GRP_DESCRIPCION",
                    &GRP_HABILITADO,
                    "&_METAPERSON",
                    "&_METAPERSON",
                    1.00,
                            0,
                    "&GRP_AREA_NEGOCIO",
                    "&GRP_ESQUEMA_VALIDO",
                    &GRP_PERIOCIDAD.,
                    &VIGENCIA_INICIO,
                    &VIGENCIA_FIN
                    ) ;
                    quit;
                    %increasesVersionValida(GRP_CODIGO=&GRP_CODIGO);
                    %InsertEvent(GRP_CODIGO="&GRP_CODIGO",
                    LOG_EVENTO="El codigo &GRP_CODIGO ha sido Creado",
                    LOG_USUARIO="&_METAPERSON",
                    LOG_TIPO_EVENTO="002");
                    %cargaEstrucutra(_programa=&GRP_CODIGO);
                %end;
                %else %do;
                    %MESSAGEBE("El esquema esta incorrecto!");
                    %SalidaWeb(Tabla=RESULT);
                %end;
            %END;
            %ELSE %DO;
                    %MESSAGEBE("El nombre &GRP_NOMBRE ya existe!");
                       %SalidaWeb(Tabla=RESULT);
            %END;

        %END;
        %ELSE %DO;
            %MESSAGEBE("El esquema es mayor a &LARGO_ESQUEMA  debe quitar los espacio o acortar el esquema!");
            %SalidaWeb(Tabla=RESULT);
        %END;


    %end;

    %if %sysfunc(exist(RESULT)) %then %do;
        %put  --->;
    %end;
    %else %do;
        %ViewRecord(tabla=BE_GRUPO_CONTROL,reg=&GRP_CODIGO);
    %end;
%mend NewRecord;