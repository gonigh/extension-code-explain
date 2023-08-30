#!/bin/bash
port_list=(80)
status=1

for port in ${port_list[*]}
do
 if netstat -lntp | grep $port
 then
  status=$(( $status && 1 ))
 else
  status=$(( $status && 0 ))
 fi
done

if [ $status == 1 ]
then
 exit 0
else
 exit 1
fi
