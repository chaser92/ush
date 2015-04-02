# Useful SHell #

A shell that uses LiveScript, a Haskell-like language for data processing.

## Run ##

`npm start`

## Usage ##

`command` - execute a command like in classic shell

`command | function` - execute a command and apply its results to a function (as a string array)

`identifier <- command [| function]` - store results in a variable

Soon:

`command |* pred` - equivalent to `command | filter pred` - filter out results based on a predicate

`command |. mapper` - equivalent to `command | map mapper` - map each value to a mapper

Currently no way to leverage usual piping (like `ls | grep ...`) or change directory. Sorry!

## Examples ##
`ls | filter (> "p")` - list only files starting with p

`ls | filter (grep "node") - no need to describe

`ls | (filter (> "p")) >> join ";"` - then join array with ;

`ls -l | (map (words >> (at 4) >> Number)) >> mean` - on my machine it takes a size column (4) from list, converts it to number and calculates average


Examples:

`ls | 
