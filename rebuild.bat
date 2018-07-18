if exist built rmdir /S built
REM mkdir built
REM tsc

cp src built -R
tsc
pause