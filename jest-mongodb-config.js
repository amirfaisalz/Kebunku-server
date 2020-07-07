module.exports = {
    mongodbMemoryServerOptions : {
        instance: {
            dbName: 'kebunku-jest'
        },
        binary: {
            skipMD5: true
        },
        autoStart: false 
    }
}