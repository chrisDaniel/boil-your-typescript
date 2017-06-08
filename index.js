
module.exports = exports = {
    boil : require('./boil/boil'),

    TsFile : require('./boil/ts-reflect/ts-file').TsFile,
    TsInterface : require('./boil/ts-reflect/ts-constructs').TsInterface,
    TsClass : require('./boil/ts-reflect/ts-constructs').TsClass,
    TsField : require('./boil/ts-reflect/ts-props').TsField,
    TsFunction : require('./boil/ts-reflect/ts-props').TsFunction,
    TsFunctArg : require('./boil/ts-reflect/ts-props').TsFunctArg,
}
