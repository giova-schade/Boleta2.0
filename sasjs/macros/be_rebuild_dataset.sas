/**
  @file
  @brief Recreates a dataset from a WORK table
  @details Used only during the makedata job, for recreating demo data from
  cards files

  @param ds The dataset to create.  Must be in the WORK library.
  @param lib= (BESASGC) The library in which to create the table.  The process
    aborts if this is not BASE or V9 (to avoid overwriting the oracle data)

  <h4> SAS Macros </h4>
  @li mf_existds.sas
  @li mf_getengine.sas
  @li mp_abort.sas

**/

%macro be_rebuild_dataset(ds, lib=BESASGC);

  /* abort for safety if lib is not BASE */
  %mp_abort(iftrue= (%mf_getengine(&lib) ne V9 and %mf_getengine(&lib) ne BASE)
    ,mac=be_rebuild_dataset
    ,msg=%str(Library &lib is unassigned, or is not a BASE engine!)
  )

  %if %mf_existds(libds=&lib..&ds) %then %do;
    proc sql;
    drop table &lib..&ds;
  %end;

  proc append base=&lib..&ds data=work.&ds;
  run;

%mend be_rebuild_dataset;