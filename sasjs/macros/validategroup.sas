/**
  @file
  @brief REFACTOR
  @details  This is a very slow way to get group membership.
  Check out mm_getgroups.  If not helpful, remove the below.

  https://core.sasjs.io/mm__getgroups_8sas.html

  <h4> SAS Macros </h4>
  @li mm_getgroups.sas

**/
%macro validateGroup(username, groupname);
%MDUEXTR(libref=work);
proc sql noprint;
select count(t2.Name) into :grpexist
from person t1
left join GROUPMEMPERSONS_INFO t2 on (t1.keyid eq  t2.memId)
where t1.name=&username. and t2.Name=&groupname.;
quit;
%put &grpexist;
%mend validateGroup;