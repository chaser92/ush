var repl = require("repl");
var exec = require("child_process").exec;
var LiveScript = require('LiveScript');
var prelude = require ('prelude-ls');
var vm = require('vm');

var replCtx = {};
for (var p in prelude) {
    replCtx[p] = prelude[p];
}
replCtx.readfile = function (fileName) {
    return require('fs').readFileSync(fileName, {encoding:'utf-8'});
};

replCtx.grep = function grep(pattern) { return function(val) {
    return val.indexOf(pattern) !== -1;
};};

replCtx.length = function (arr) {
    return arr.length;
};

repl.start({
    eval: evalRepl,
    ignoreUndefined: true
});

//process.stdout.write(__dirname + "~$>");


function output(data) {
    return data;
}

function evalRepl(cmd, context, filename, callback) {
    cmd = cmd.substring(1, cmd.length - 2);
    var idcmd = cmd.split("<-");
    var toStore;
    if (idcmd.length === 2) {
        toStore = idcmd[0];
        cmd = idcmd[1];
    }

    var shellCmd = cmd.split("|")[0];
    var funCmd = cmd.split("|")[1];
    var func;
    if (!funCmd) {
        func = function(x) { return x; };
    } else {
        try { 
            func = vm.runInNewContext(LiveScript.compile( funCmd, {bare:true}), replCtx, 'repl');
            if (typeof func !== "function") 
                return callback(null, func);
        } catch (e) {
            return callback(null, e);
        }
        
    }
    exec(shellCmd, function(error, stdout, stderr) {
        stdout = stdout.substring(0, stdout.length - 1);
        var result = func(stdout.split("\n"));
        if (toStore) {
            replCtx[toStore.trim()] = result;
        }

        callback(null, result);
        //process.stdout.write(__dirname + "~$> ");
    });
}