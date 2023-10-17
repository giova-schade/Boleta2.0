/**
  @file
  @brief Create sample data library
  @details This program is typically run once during environment configuration

  <h4> SAS Includes </h4>
  @li BE_CONTRIBUYENTE_SEGMENTO.sas contrib
  @li BE_CONTROL_PROCESO.sas control
  @li BE_GRUPO_ATRIBUTO.sas grupatr
  @li BE_GRUPO_CONTROL.sas grupcon
  @li BE_LOG_EVENTO.sas logevent
  @li BE_VALIDA_GRUPO.sas validagr

  <h4> SAS Macros </h4>
  @li be_rebuild_dataset.sas

**/

/* create the WORK datasets from DATALINES */
%inc contrib /source2;
%inc control /source2;
%inc grupatr /source2;
%inc grupcon /source2;
%inc logevent /source2;
%inc validagr /source2;

/* delete the source dataset and append the WORK table in BESASGC */
%be_rebuild_dataset(BE_CONTRIBUYENTE_SEGMENTO)
%be_rebuild_dataset(BE_CONTROL_PROCESO)
%be_rebuild_dataset(BE_GRUPO_ATRIBUTO)
%be_rebuild_dataset(BE_GRUPO_CONTROL)
%be_rebuild_dataset(BE_LOG_EVENTO)
%be_rebuild_dataset(BE_VALIDA_GRUPO)
