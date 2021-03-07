const PROXY_CONFIG = [
    {
        context: [
            "/Auth",
            "/Dropdown",
            "/EmergencyRegister",
            "/RescueDetails",
            "/Health",
            "/Caller",
            "/Patient",
            "/Login",
            "/Location",
            "/EventEmitter",
            "/SurgeryRegister",
            "/Messaging",
            "/CensusData",
            "/PrintTemplate",
            "/Treatment",
            "/Users",
            "/Teams",
            "/UserAdmin",
            "/ReleaseDetails",
            "/StreetTreat",
            "/Reporting",
            "/Logs"
        ],
        target: "http://localhost:8080/",
        changeOrigin: "true",
        secure: true
    }
]

module.exports = PROXY_CONFIG;
